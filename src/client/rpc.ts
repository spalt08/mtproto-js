/* eslint-disable import/no-cycle */
import pako from 'pako';
import TLAbstract from '../tl/abstract';
import TLConstructor from '../tl/constructor';
import TLVector from '../tl/vector';
import { logs } from '../utils/log';
import { Message } from '../message';
import { Bytes, uint } from '../serialization';
import { Client } from '.';
import { RequestCallback } from './client';
import { RPCHeaders, ClientError } from './rpc.types';

const log = logs('rpc');

/**
 * Service class helper for processing rpc messages
 */
export default class RPCService {
  /** Client Handler */
  client: Client;

  /** Message Callbacks */
  messages: Record<string, {
    msg: Message,
    headers: RPCHeaders,
    cb: RequestCallback,
  }>;

  /** Pending message acknowlegments  */
  pendingAcks: Record<number, Array<string>>;

  /**
   * Creates auth service object
   */
  constructor(client: Client) {
    this.client = client;

    this.messages = {};
    this.pendingAcks = [];
  }

  /**
   * Subscribes callback to message identificator
   */
  subscribe(msg: Message, headers: RPCHeaders, cb?: RequestCallback) {
    const msgID = msg.id;

    if (cb) {
      log('<- rpc_request', msgID, `(${headers.transport}, thread: ${headers.thread}, seq: ${msg.seqNo})`);
      this.messages[msgID] = { msg, headers, cb };
    }
  }

  /**
   * Call callback due to message id
   */
  emitResponse(msgID: string, error: ClientError | null, res?: TLAbstract) {
    if (this.messages[msgID]) {
      // Call callback with error
      if (error) this.messages[msgID].cb(error);

      if (res) {
        if (res instanceof TLConstructor && res._ === 'gzip_packed') {
          const gzData = res.params.packed_data.value;
          const buf = new Bytes(pako.inflate(gzData).buffer);

          const result = this.client.tl.parse(buf);

          log(this.messages[msgID].headers.dc, '-> ', result._, msgID);

          this.messages[msgID].cb(null, result);
        } else {
          log(this.messages[msgID].headers.dc, '-> ', res._, msgID);
          this.messages[msgID].cb(null, res);
        }
      }

      delete this.messages[msgID];
    }
  }

  /**
   * Resends request message by id
   */
  resend(msgID: string, changeSeq: boolean = false) {
    const request = this.messages[msgID];

    if (request) {
      request.msg.salt = this.client.svc.getSalt(request.headers.dc);

      if (changeSeq) request.msg.seqNo = this.client.svc.nextSeqNo(request.headers.dc, true);

      this.client.call(request.msg, request.headers, request.cb);
      log(request.headers.dc, '<- re-sent', msgID);
    }
  }

  /**
   * Adds message ID to ack pending list
   */
  ackMsg(transport: string, dc: number, thread: number, ...msgIDs: string[]) {
    const key = thread / 10 + dc + (transport === 'websocket' ? 1000 : 0);

    if (!this.pendingAcks[key]) this.pendingAcks[key] = [];

    for (let i = 0; i < msgIDs.length; i += 1) {
      if (this.pendingAcks[key].indexOf(msgIDs[i]) === -1) this.pendingAcks[key].push(msgIDs[i]);
    }
  }

  /**
   * Sends message acks from pending list
   */
  sendAcks(transport: string, dc: number, thread: number) {
    const key = thread / 10 + dc + (transport === 'websocket' ? 1000 : 0);

    if (!this.pendingAcks[key]) this.pendingAcks[key] = [];

    if (this.pendingAcks[key].length > 0) {
      const ids = this.pendingAcks[key].map((id) => uint(id));

      this.client.call('msgs_ack', { msg_ids: ids }, { dc, thread, force: true });
      this.pendingAcks[key] = [];
    }
  }

  /**
   * Processes RPC response messages
   */
  processMessage(result: TLAbstract, headers: RPCHeaders, ack: boolean = true) {
    switch (result._) {
      case 'msg_container': this.processMessageContainer(result, headers); break;
      case 'new_session_created': this.processSessionCreated(result, headers); break;
      case 'bad_server_salt': this.processBadServerSalt(result, headers); break;
      case 'bad_msg_notification': this.processBadMsgNotification(result, headers); break;
      case 'msgs_ack': break;
      case 'rpc_result': this.processRPCResult(result, headers); break;

      default:
        if (result instanceof TLConstructor && result.declaration) {
          if (result.declaration.type === 'Updates') {
            this.client.updates.process(result);
          }
        } else {
          log(headers.dc, '-> unknown %s', result._, result);
        }

        if (headers.msgID) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.msgID);
        break;
    }

    if (ack) this.sendAcks(headers.transport, headers.dc, headers.thread);
  }

  /**
   * Processes: msg_container
   */
  processMessageContainer(result: TLAbstract, headers: RPCHeaders) {
    if (result instanceof TLConstructor && result.params.messages instanceof TLVector) {
      for (let i = 0; i < result.params.messages.items.length; i += 1) {
        const item = result.params.messages.items[i];

        if (item instanceof TLConstructor) {
          this.ackMsg(headers.transport, headers.dc, headers.thread, item.params.msg_id.buf!.lhex);

          this.processMessage(item.params.body, {
            ...headers,
            msgID: item.params.msg_id.buf!.lhex,
          }, false);
        }
      }
    }
  }

  /**
   * Processes: bad_server_salt
   */
  processBadServerSalt(result: TLAbstract, headers: RPCHeaders) {
    log(headers.dc, '-> bad_server_salt', `(${headers.transport}, thread: ${headers.thread})`);

    if (headers.msgID) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.msgID);

    if (result instanceof TLConstructor) {
      const msgID = result.params.bad_msg_id.buf!.lhex;
      const newSalt = result.params.new_server_salt.buf!.hex;

      this.client.svc.setMeta(headers.dc, 'salt', newSalt);
      this.resend(msgID);
    }
  }

  /**
   * Processes: new_session_created
   */
  processSessionCreated(result: TLAbstract, headers: RPCHeaders) {
    log(headers.dc, '-> new_session_created', `(${headers.transport}, thread: ${headers.thread})`);

    if (headers.msgID) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.msgID);

    if (result instanceof TLConstructor) {
      const newSalt = result.params.server_salt.buf!.hex;
      this.client.svc.setMeta(headers.dc, 'salt', newSalt);
    }
  }

  /**
   * Processes: bad_msg_notification
   */
  processBadMsgNotification(result: TLAbstract, headers: RPCHeaders) {
    if (result instanceof TLConstructor) {
      log(headers.dc, '-> bad_msg_notification', result.params.bad_msg_id.buf!.hex, result.params.error_code.value);

      if (result.params.error_code.value === 32) {
        this.resend(result.params.bad_msg_id.buf!.lhex, true);
      }

      // To Do: sync server time

      if (headers.msgID) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.msgID);
    }
  }

  /**
   * Processes: rpc_result
   */
  processRPCResult(res: TLAbstract, headers: RPCHeaders) {
    if (res instanceof TLConstructor) {
      const { result } = res.params;
      const reqMsgID = res.params.req_msg_id.buf!.lhex;

      log(headers.dc, '-> rpc_result', reqMsgID, `(${headers.transport}, thread: ${headers.thread})`);

      if (headers.msgID) this.ackMsg(headers.transport, headers.dc, headers.thread, headers.msgID);

      switch (result._) {
        case 'rpc_error':
          if (result instanceof TLConstructor) {
            this.emitResponse(reqMsgID, {
              type: 'rpc',
              code: result.params.error_code.value,
              message: result.params.error_message.value,
            });
          }
          console.log('rpc err', this.messages[reqMsgID], `(${headers.transport}, thread: ${headers.thread})`);
          break;

        default:
          this.emitResponse(reqMsgID, null, result);
      }
    }
  }
}
