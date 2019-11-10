import pako from 'pako';

import TypeLanguage from '../tl';
import TLAbstract from '../tl/abstract';
import TLConstructor from '../tl/constructor';
import TLVector from '../tl/vector';
import { logs } from '../utils/log';
import Transport, { ResponseCallback, TranportError } from '../transport/abstract';
import { Message } from '../message';
import { Bytes, uint } from '../serialization';

const log = logs('rpc');

/**
 * Service class helper for processing rpc messages
 */
export default class RPCService {
  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /** Message Callbacks */
  messages: Record<string, {
    msg: Message,
    headers: Record<string, any>,
    cb: ResponseCallback,
  }>;

  /** Pending message acknowlegments  */
  pendingAcks: Array<string>;

  /**
   * Creates auth service object
   */
  constructor(transport: Transport, tl: TypeLanguage) {
    this.tl = tl;
    this.transport = transport;

    this.messages = {};
    this.pendingAcks = [];
  }

  /**
   * Subscribes callback to message identificator
   */
  subscribe(msg: Message, headers: Record<string, any>, cb?: ResponseCallback) {
    const msgID = msg.id;

    log('<- rpc_call', msgID);

    if (cb) {
      this.messages[msgID] = { msg, headers, cb };
    }
  }

  /**
   * Call callback due to message id
   */
  emitResponse(msgID: string, error: TranportError | null, res?: TLAbstract, headers?: Record<string, any>) {
    if (this.messages[msgID]) {
      if (error) this.messages[msgID].cb(error);

      if (res) {
        if (res instanceof TLConstructor && res._ === 'gzip_packed') {
          const gzData = res.params.packed_data.value;
          const buf = new Bytes(pako.inflate(gzData).buffer);

          const result = this.tl.parse(buf);

          log('-> ', result._, msgID);

          this.messages[msgID].cb(null, result, headers);
          delete this.messages[msgID];
        } else {
          log('-> ', res._, msgID);
          this.messages[msgID].cb(error, res, headers);
          delete this.messages[msgID];
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
      request.msg.salt = this.transport.dc.getSalt(request.headers.dcID);

      if (changeSeq) request.msg.seqNo = this.transport.dc.nextSeqNo(request.headers.dcID, true);

      this.transport.call(request.msg, request.headers, request.cb);
      log('re-sent', msgID);
    }
  }

  /**
   * Adds message ID to ack pending list
   */
  ackMsg(...msgIDs: string[]) {
    for (let i = 0; i < msgIDs.length; i += 1) {
      if (this.pendingAcks.indexOf(msgIDs[i]) === -1) this.pendingAcks.push(msgIDs[i]);
    }
  }

  /**
   * Sends message acks from pending list
   */
  sendAcks() {
    if (this.pendingAcks.length > 0) {
      this.transport.call('msgs_ack', { msg_ids: this.pendingAcks.map((id) => uint(id)) });
      this.pendingAcks = [];
    }
  }

  /**
   * Processes RPC response messages
   */
  processMessage(result: TLAbstract, headers: Record<string, any>, ack: boolean = true) {
    switch (result._) {
      case 'msg_container': this.processMessageContainer(result, headers); break;
      case 'new_session_created': this.processSessionCreated(result, headers); break;
      case 'bad_server_salt': this.processBadServerSalt(result, headers); break;
      case 'bad_msg_notification': this.processBadMsgNotification(result, headers); break;
      case 'msgs_ack': break;
      case 'rpc_result': this.processRPCResult(result, headers); break;

      default:
        // if (result instanceof TLConstructor && result.declaration) {
        //   if (result.declaration.type === 'Updates') {
        //     this.transport.updates.process(result);
        //   }
        // } else {
        log('unknown %s', result._, result);
        // }

        if (headers.msgID) this.ackMsg(headers.msgID);
        break;
    }

    if (ack) this.sendAcks();
  }

  /**
   * Processes: msg_container
   */
  processMessageContainer(result: TLAbstract, headers: Record<string, any>) {
    if (result instanceof TLConstructor && result.params.messages instanceof TLVector) {
      for (let i = 0; i < result.params.messages.items.length; i += 1) {
        const item = result.params.messages.items[i];

        if (item instanceof TLConstructor) {
          this.ackMsg(item.params.msg_id.buf!.lhex);

          this.processMessage(item.params.body, {
            ...headers,
            msgID: item.params.msg_id.buf!.lhex,
            seqNum: item.params.seqno.value,
          }, false);
        }
      }
    }
  }

  /**
   * Processes: bad_server_salt
   */
  processBadServerSalt(result: TLAbstract, headers: Record<string, any>) {
    log('-> bad_server_salt');

    if (headers.msgID) this.ackMsg(headers.msgID);

    if (result instanceof TLConstructor) {
      const msgID = result.params.bad_msg_id.buf!.lhex;
      const newSalt = result.params.new_server_salt.buf!.hex;

      this.transport.dc.setMeta(headers.dcID, 'salt', newSalt);
      this.resend(msgID);
    }
  }

  /**
   * Processes: new_session_created
   */
  processSessionCreated(result: TLAbstract, headers: Record<string, any>) {
    log('-> new_session_created');

    if (headers.msgID) this.ackMsg(headers.msgID);

    if (result instanceof TLConstructor) {
      const newSalt = result.params.server_salt.buf!.hex;
      this.transport.dc.setMeta(headers.dcID, 'salt', newSalt);
    }
  }

  /**
   * Processes: bad_msg_notification
   */
  processBadMsgNotification(result: TLAbstract, headers: Record<string, any>) {
    if (result instanceof TLConstructor) {
      log('-> bad_msg_notification', result.params.bad_msg_id.buf!.hex, result.params.error_code.value);

      if (result.params.error_code.value === 32) {
        this.resend(result.params.bad_msg_id.buf!.lhex, true);
      }

      // To Do: sync server time

      if (headers.msgID) this.ackMsg(headers.msgID);
    }
  }

  /**
   * Processes: rpc_result
   */
  processRPCResult(res: TLAbstract, headers: Record<string, any>) {
    if (res instanceof TLConstructor) {
      const { result } = res.params;
      const reqMsgID = res.params.req_msg_id.buf!.lhex;

      log('-> rpc_result', reqMsgID);

      if (headers.msgID) this.ackMsg(headers.msgID);

      switch (result._) {
        case 'rpc_error':
          if (result instanceof TLConstructor) {
            this.emitResponse(reqMsgID, {
              type: 'rpc',
              code: result.params.error_code.value,
              message: result.params.error_message.value,
            });
          }
          break;

        default:
          this.emitResponse(reqMsgID, null, result, headers);
      }
    }
  }
}
