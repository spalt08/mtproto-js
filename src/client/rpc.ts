import { inflate } from 'pako/lib/inflate';
import { logs } from '../utils/log';
import { Message } from '../message';
import { ab2i, Reader32 } from '../serialization';
import { RPCHeaders, ClientError, ClientInterface, ClientConfig, RequestRPC, PlainCallback, MessageHeaders } from './types';
import { parse } from '../tl';
import { Object, BadMsgNotification, NewSession, RpcResult } from '../tl/mtproto/types';

const debug = (cfg: ClientConfig, ...rest: any[]) => {
  if (cfg.debug) logs('rpc')(...rest);
};

/**
 * Service class helper for processing rpc messages
 */
export default class RPCService {
  /** Client Handler */
  client: ClientInterface;

  /** Outcoming requests */
  requests: Record<string, RequestRPC>;

  /** Pending message acknowlegments  */
  pendingAcks: Record<number, string[]>;

  /**
   * Creates auth service object
   */
  constructor(client: ClientInterface) {
    this.client = client;

    this.requests = {};
    this.pendingAcks = [];
  }

  /**
   * Subscribes callback to message identificator
   */
  subscribe(message: Message, headers: MessageHeaders, cb?: PlainCallback<any>) {
    if (this.requests[message.id] && !cb) {
      cb = this.requests[message.id].cb;
    }

    this.requests[message.id] = {
      message,
      headers,
      cb,
    };

    if (cb) debug(this.client.cfg, headers.dc, '<- request', message.id, `(thread: ${headers.thread}, seq: ${message.seqNo})`);
  }

  /**
   * Call callback due to message id
   */
  emit(id: string, error: ClientError, data?: any) {
    if (!id) return;

    if (!this.requests[id]) {
      debug(this.client.cfg, 'unknown request for ', id);
      return;
    }

    const request = this.requests[id];

    // Call callback with error
    if (error !== null) {
      if (request.cb) request.cb(error);
      delete this.requests[id];
      return;
    }

    // Success response
    if (!data) throw new Error('Expected type language constructor for response');

    // if (result && result.declaration && result.declaration.type === 'Updates') {
    //   this.client.updates.process(result);
    // }

    // Process response
    debug(this.client.cfg, request.headers.dc, 'rpc result', request.headers.method, '-> ', data, `(request id: ${id})`);

    if (request.cb) request.cb(null, data);

    delete this.requests[id];

    // Apply middleware
    this.middleware(request, data);
  }

  /**
   * Middlewares
   */
  middleware = (request: RequestRPC, result: any) => {
    if (result._ === 'auth.authorization') {
      debug(this.client.cfg, 'middleware', result._);
      this.client.dc.setAuthorization(request.headers.dc!, result.user.id);
    }
  };

  /**
   * Resends request message by id
   */
  resend(id: string, forceChangeSeq: boolean = false) {
    const request = this.requests[id];

    if (!request) {
      console.warn(`Cannot resend missing request ${id}`); // eslint-disable-line no-console
      return;
    }

    request.message.salt = this.client.dc.getSalt(request.headers.dc);
    if (forceChangeSeq) request.message.seqNo = this.client.dc.nextSeqNo(request.headers.dc, true);

    this.client.send(request.message, request.headers);

    debug(this.client.cfg, request.headers.dc, '<- re-sent', id);
  }

  /**
   * Adds message ID to ack pending list
   */
  ackMsg(transport: string, dc: number, thread: number, ...ids: string[]) {
    const key = thread * 10 + dc + (transport === 'websocket' ? 1000 : 0);

    if (!this.pendingAcks[key]) this.pendingAcks[key] = [];

    for (let i = 0; i < ids.length; i += 1) {
      if (this.pendingAcks[key].indexOf(ids[i]) === -1) this.pendingAcks[key].push(ids[i]);
    }
  }

  /**
   * Sends message acks from pending list
   */
  sendAcks(transport: string, dc: number, thread: number) {
    const key = thread * 10 + dc + (transport === 'websocket' ? 1000 : 0);

    if (!this.pendingAcks[key]) this.pendingAcks[key] = [];

    if (this.pendingAcks[key].length > 0) {
      const ids = this.pendingAcks[key].map((id) => id);

      this.client.call('msgs_ack', { msg_ids: ids }, { dc, thread, force: true });
      this.pendingAcks[key] = [];
    }
  }

  /**
   * Processes RPC response messages
   */
  processMessage(result: any, headers: RPCHeaders, ack: boolean = true) {
    debug(this.client.cfg, headers.dc, '->', result._);

    switch (result._) {
      case 'msg_container': this.processMessageContainer(result, headers); break;
      case 'new_session_created': this.processSessionCreated(result, headers); break;
      case 'bad_server_salt': this.processBadServerSalt(result, headers); break;
      case 'bad_msg_notification': this.processBadMsgNotification(result, headers); break;
      case 'msgs_ack': break;
      case 'gzip_packed': this.processGzipped(result, headers); break;
      case 'rpc_result': this.processRPCResult(result, headers); break;
      case 'msg_detailed_info': break;

      default:
        // send acknowlegment
        if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

        // updates
        // if (result instanceof TLConstructor && result.declaration) {
        //   if (result.declaration.type === 'Updates') {
        //     this.client.updates.process(result);
        //     break;
        //   }
        // }

        console.warn('unknown', result._, result); // eslint-disable-line no-console
        debug(this.client.cfg, headers.dc, '-> unknown %s', result._, result);

        break;
    }

    if (ack) this.sendAcks(headers.transport, headers.dc, headers.thread);
  }

  /**
   * Process: gzip_packed
   */
  processGzipped(result: Object.gzip_packed, headers: RPCHeaders) {
    try {
      const gz = new Uint8Array(result.packed_data);
      const reader = new Reader32(ab2i(inflate(gz).buffer));
      this.processMessage(parse(reader), headers, false);
    } catch (e) {
      console.warn('Unable to decode gzip data', e); // eslint-disable-line no-console
    }
  }

  /**
   * Process: msg_container
   */
  processMessageContainer(result: any /* MessageContainer.msg_container */, headers: RPCHeaders) {
    for (let i = 0; i < result.messages.length; i += 1) {
      const item = result.messages[i];

      this.ackMsg(headers.transport, headers.dc, headers.thread, item.msg_id);

      this.processMessage(item.body, {
        ...headers,
        id: item.msg_id,
      }, false);
    }
  }

  /**
   * Process: bad_server_salt
   */
  processBadServerSalt(result: BadMsgNotification.bad_server_salt, headers: RPCHeaders) {
    debug(this.client.cfg, headers.dc, '-> bad_server_salt', `(${headers.transport}, thread: ${headers.thread})`);

    if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

    this.client.dc.setSalt(headers.dc, result.new_server_salt);
    this.resend(result.bad_msg_id);
  }

  /**
   * Processes: new_session_created
   */
  processSessionCreated(result: NewSession.new_session_created, headers: RPCHeaders) {
    debug(this.client.cfg, headers.dc, '-> new_session_created', `(${headers.transport}, thread: ${headers.thread})`);

    if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

    this.client.dc.setSalt(headers.dc, result.server_salt);
  }

  /**
   * Processes: bad_msg_notification
   */
  processBadMsgNotification(result: BadMsgNotification.bad_msg_notification, headers: RPCHeaders) {
    debug(this.client.cfg, headers.dc, '-> bad_msg_notification', result.bad_msg_id, result.error_code, 'sec:', result.bad_msg_seqno);

    if (result.error_code === 32) {
      this.resend(result.bad_msg_id, true);
    }

    // To Do: sync server time

    if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);
  }

  /**
   * Processes: rpc_result
   */
  processRPCResult(res: RpcResult.rpc_result, headers: RPCHeaders) {
    let { result } = res as any;
    const reqID = res.req_msg_id;

    if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

    // Ungzip if gzipped
    if (result && result._ === 'gzip_packed') {
      const gz = new Uint8Array(result.packed_data);
      const reader = new Reader32(ab2i(inflate(gz)));
      result = parse(reader) as any;
    }

    switch (result._) {
      case 'rpc_error':
        this.emit(reqID, {
          type: 'rpc',
          code: result.error_code,
          message: result.error_message,
        }, result);

        debug(this.client.cfg, headers.dc, '-> rpc_error', reqID, `(${headers.transport}, thread: ${headers.thread})`, result);
        break;

      default:
        this.emit(reqID, null, result);
    }
  }
}
