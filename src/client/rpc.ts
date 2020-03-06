import { inflate } from 'pako/lib/inflate';
import TLAbstract from '../tl/abstract';
import TLConstructor from '../tl/constructor';
import TLVector from '../tl/vector';
import { logs } from '../utils/log';
import { Message } from '../message';
import { Bytes, hex } from '../serialization';
import {
  RPCHeaders, ClientError, ClientInterface, ClientConfig, RequestCallback, Transports, RequestRPC,
} from './types';

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
  subscribe(message: Message, dc: number, thread: number, transport: Transports, cb?: RequestCallback) {
    if (this.requests[message.id]) {
      console.log('Message ID already waiting for response');
    }

    this.requests[message.id] = {
      message,
      dc,
      thread,
      transport,
      cb,
    };

    if (cb) debug(this.client.cfg, dc, '<- request', message.id, `(thread: ${thread}, seq: ${message.seqNo})`);
  }

  /**
   * Call callback due to message id
   */
  emit(id: string, error: ClientError, data?: TLAbstract) {
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

    let result = data;

    // Ungzip if gzipped
    if (data instanceof TLConstructor && data._ === 'gzip_packed') {
      const gz = hex(data.params.packed_data.value);
      const buffer = new Bytes(inflate(gz.buffer).buffer);
      result = this.client.tl.parse(buffer);
    }

    if (result instanceof TLConstructor && result.declaration && result.declaration.type === 'Updates') {
      this.client.updates.process(result);
    }

    // Process response
    debug(this.client.cfg, Date.now(), request.dc, '-> ', result._, `(request: ${id})`);
    if (request.cb) request.cb(null, result);

    delete this.requests[id];

    // Apply middleware
    this.middleware(request, result);
  }

  /**
   * Middlewares
   */
  middleware = (request: RequestRPC, result: TLAbstract) => {
    if (result._ === 'auth.authorization') {
      debug(this.client.cfg, 'middleware', result._);
      const { user } = result.json();
      this.client.dc.setMeta(request.dc, 'userID', user.id);
    }
  };

  /**
   * Resends request message by id
   */
  resend(id: string, forceChangeSeq: boolean = false) {
    const request = this.requests[id];

    if (!request) {
      console.warn(`Cannot resend missing request ${id}`);
      return;
    }

    request.message.salt = this.client.dc.getSalt(request.dc);
    if (forceChangeSeq) request.message.seqNo = this.client.dc.nextSeqNo(request.dc, true);

    this.client.call(request.message, { dc: request.dc, thread: request.thread, transport: request.transport });

    debug(this.client.cfg, request.dc, '<- re-sent', id);
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
  processMessage(result: TLAbstract, headers: RPCHeaders, ack: boolean = true) {
    debug(this.client.cfg, headers.dc, '->', result._);

    switch (result._) {
      case 'msg_container': this.processMessageContainer(result, headers); break;
      case 'new_session_created': this.processSessionCreated(result, headers); break;
      case 'bad_server_salt': this.processBadServerSalt(result, headers); break;
      case 'bad_msg_notification': this.processBadMsgNotification(result, headers); break;
      case 'msgs_ack': break;
      case 'gzip_packed': this.processGzipped(result, headers); break;
      case 'rpc_result': this.processRPCResult(result, headers); break;

      default:
        // updates
        if (result instanceof TLConstructor && result.declaration) {
          if (result.declaration.type === 'Updates') {
            this.client.updates.process(result);
          }

        // fallback
        } else {
          debug(this.client.cfg, headers.dc, '-> unknown %s', result._, result);
        }

        // send acknowlegment
        if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);
        break;
    }

    if (ack) this.sendAcks(headers.transport, headers.dc, headers.thread);
  }

  /**
   * Process: gzip_packed
   */
  processGzipped(result: TLAbstract, headers: RPCHeaders) {
    if (result instanceof TLConstructor) {
      try {
        const gz = hex(result.params.packed_data.value);
        const buffer = new Bytes(inflate(gz.buffer).buffer);

        this.processMessage(this.client.tl.parse(buffer), headers, false);
      } catch (e) {
        console.warn('Unable to decode gzip data', e);
      }
    }
  }

  /**
   * Process: msg_container
   */
  processMessageContainer(result: TLAbstract, headers: RPCHeaders) {
    if (result instanceof TLConstructor && result.params.messages instanceof TLVector) {
      for (let i = 0; i < result.params.messages.items.length; i += 1) {
        const item = result.params.messages.items[i];

        if (item instanceof TLConstructor) {
          this.ackMsg(headers.transport, headers.dc, headers.thread, item.params.msg_id.buf!.lhex);

          this.processMessage(item.params.body, {
            ...headers,
            id: item.params.msg_id.buf!.lhex,
          }, false);
        }
      }
    }
  }

  /**
   * Process: bad_server_salt
   */
  processBadServerSalt(result: TLAbstract, headers: RPCHeaders) {
    debug(this.client.cfg, headers.dc, '-> bad_server_salt', `(${headers.transport}, thread: ${headers.thread})`);

    if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

    if (result instanceof TLConstructor) {
      const msgID = result.params.bad_msg_id.buf!.lhex;
      const newSalt = result.params.new_server_salt.buf!.hex;

      this.client.dc.setMeta(headers.dc, 'salt', newSalt);
      this.resend(msgID);
    }
  }

  /**
   * Processes: new_session_created
   */
  processSessionCreated(result: TLAbstract, headers: RPCHeaders) {
    debug(this.client.cfg, headers.dc, '-> new_session_created', `(${headers.transport}, thread: ${headers.thread})`);

    if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

    if (result instanceof TLConstructor) {
      const newSalt = result.params.server_salt.buf!.hex;
      this.client.dc.setMeta(headers.dc, 'salt', newSalt);
    }
  }

  /**
   * Processes: bad_msg_notification
   */
  processBadMsgNotification(result: TLAbstract, headers: RPCHeaders) {
    if (result instanceof TLConstructor) {
      debug(this.client.cfg, headers.dc, '-> bad_msg_notification', result.params.bad_msg_id.buf!.lhex, result.params.error_code.value, 'sec:',
        result.params.bad_msg_seqno.value);

      if (result.params.error_code.value === 32) {
        this.resend(result.params.bad_msg_id.buf!.lhex, true);
      }

      // To Do: sync server time

      if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);
    }
  }

  /**
   * Processes: rpc_result
   */
  processRPCResult(res: TLAbstract, headers: RPCHeaders) {
    if (res instanceof TLConstructor) {
      const { result } = res.params;
      const reqID = res.params.req_msg_id.buf!.lhex;


      if (headers.id) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.id);

      switch (result._) {
        case 'rpc_error':
          if (result instanceof TLConstructor) {
            this.emit(reqID, {
              type: 'rpc',
              code: result.params.error_code.value,
              message: result.params.error_message.value,
            }, result);
          }

          debug(this.client.cfg, headers.dc, '-> rpc_error', reqID, `(${headers.transport}, thread: ${headers.thread})`, result.json());
          break;

        default:
          this.emit(reqID, null, result);
      }
    }
  }
}
