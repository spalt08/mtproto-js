// @flow

import pako from 'pako';

import type { Transport, RPCResult } from '../interfaces';

import TypeLanguage from '../tl';
import TLAbstract from '../tl/abstract';
import TLConstructor from '../tl/constructor';
import TLVector from '../tl/vector';
import { Hex, GenericBuffer, MessageData } from '../serialization';
import { logs } from '../utils/log';

const log = logs('rpc');

type RPCError = {
  error_code: number,
  error_message: string,
};

/**
 * Service class helper for processing rpc messages
 */
export default class RPCService {
  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /** Message Callbacks */
  messages: {
    [string]: {
      msg: MessageData,
      resolve: (RPCResult) => any,
      reject: (RPCError) => any,
    }
  }

  /**
   * Creates auth service object
   * @param {transport} transport Transport Handler
   * @param {TypeLanguage} tl Type Language Handler
   * @constructs
   */
  constructor(transport: Transport, tl: TypeLanguage) {
    this.tl = tl;
    this.transport = transport;

    this.messages = {};
  }

  /**
   * Subscribes callback to message identificator
   * @param {MessageData} msg Sent message
   * @param {func} resolve Promise resove function
   * @returns {Promise<RPCResult>} Promise for response
   */
  subscribe(msg: MessageData): Promise<RPCResult> {
    const msgID = msg.getMessageID().toString();
    const { _ } = this.tl.parse(msg);

    log('<- %s #%s seq: %d', _, msgID, msg.getSequenceNum());

    return new Promise((resolve: (RPCResult) => any, reject: (RPCError) => any) => {
      if (_ === 'msgs_ack') {
        resolve({ result: new TLAbstract(), headers: {} });
      } else {
        this.messages[msgID] = { msg, resolve, reject };
      }
    });
  }

  /**
   * Call callback due to message id
   * @param {string} msgID Request message identificator
   * @param {RPCResult} responseMsg Response Message
   */
  emitResponse(msgID: string | string, response?: RPCResult, error?: RPCError) {
    if (this.messages[msgID]) {
      if (error) this.messages[msgID].reject(error);
      if (response) {
        const { result, headers } = response;

        if (result instanceof TLConstructor && result._ === 'gzip_packed') {
          const gzData = result.params.packed_data.hex.toBuffer();
          const buf = new GenericBuffer(pako.inflate(gzData).buffer);

          const res = this.tl.parse(buf);

          log('-> %s #%s', res._, msgID);
          this.messages[msgID].resolve({ result: res, headers });
        } else {
          log('-> %s #%s', result._, msgID);
          this.messages[msgID].resolve(response);
        }
      }

      delete this.messages[msgID];
    }
  }

  /**
   * Resends request message by id
   * @param {string} msgID Request message identificator
   */
  resend(msgID: string) {
    const request = this.messages[msgID.toString()];

    if (request) {
      request.msg
        .setSalt(this.transport.services.session.serverSalt)
        .setMessageID();

      this.transport.call(this.messages[msgID.toString()].msg);
      log('re-sent %s', msgID);
    }
  }

  /**
   * Resends request message by id
   * @param {string} msgID Request message identificator
   */
  ackMsg(...msgIDs: Hex[]) {
    this.transport.call(
      this.tl.create('msgs_ack', { msg_ids: msgIDs }),
    );
  }

  /**
   * Processes RPC response messages
   * @param {RPCResult} msg Received message
   */
  processMessage(msg: RPCResult) {
    const { result, headers } = msg;

    switch (result._) {
      case 'msg_container': this.processMessageContainer(msg); break;
      case 'new_session_created': this.processSessionCreated(msg); break;
      case 'bad_server_salt': this.processBadServerSalt(msg); break;
      case 'bad_msg_notification': this.processBadMsgNotification(msg); break;
      case 'msgs_ack': RPCService.processMsgAck(msg); break;
      case 'rpc_result': this.processRPCResult(msg); break;

      default:
        log('unknown %s', result._, result);
        if (headers.msgID) this.ackMsg(headers.msgID);
        break;
    }
  }

  /**
   * Processes: msg_container
   * @param {RPCResult} msg Received message
   */
  processMessageContainer(msg: RPCResult) {
    log('-> msg_container');

    const { result } = msg;

    if (result instanceof TLConstructor && result.params.messages instanceof TLVector) {
      for (let i = 0; i < result.params.messages.items.length; i += 1) {
        const item = result.params.messages.items[i];

        if (item instanceof TLConstructor) {
          this.processMessage({
            result: item.params.body,
            headers: {
              msgID: item.params.msg_id.hex,
              seqNum: item.params.seqno.value,
            },
          });
        }
      }
    }
  }

  /**
   * Processes: bad_server_salt
   * @param {RPCResult} msg Received message
   */
  processBadServerSalt(msg: RPCResult) {
    log('-> bad_server_salt');

    const { result, headers } = msg;

    const msgID = result.params.bad_msg_id.hex;
    const newSalt = result.params.new_server_salt.hex.reverseBytes();

    this.transport.services.session.serverSalt = newSalt;
    this.resend(msgID.toString());

    if (headers.msgID) this.ackMsg(headers.msgID);
  }

  /**
   * Processes: new_session_created
   * @param {RPCResult} msg Received message
   */
  processSessionCreated(msg: RPCResult) {
    log('-> new_session_created');

    const { headers } = msg;
    if (headers.msgID) this.ackMsg(headers.msgID);
  }

  /**
   * Processes: bad_msg_notification
   * @param {RPCResult} msg Received message
   */
  processBadMsgNotification(msg: RPCResult) {
    const { result } = msg;

    log('-> bad_msg_notification #%s code: %d', result.params.bad_msg_id.hex.toString(), result.params.error_code.value);

    return this;
  }

  /**
   * Processes: msgs_ack
   * @param {RPCResult} msg Received message
   * @static
   */
  static processMsgAck(msg: RPCResult) {
    const { result } = msg;

    if (result.params.msg_ids instanceof TLVector) {
      log(`-> msgs_ack #${result.params.msg_ids.items.map((i) => i.hex.toString()).join(', #')}`);
    }
  }

  /**
   * Processes: rpc_result
   * @param {RPCResult} msg Received message
   */
  processRPCResult(msg: RPCResult) {
    const { result: res, headers } = msg;
    const { result } = res.params;
    const reqMsgID = res.params.req_msg_id.hex.toString();

    log('-> rpc_result #%s', reqMsgID);

    switch (result._) {
      case 'rpc_error':
        log('-> rpc_error %d %s', result.params.error_code.value, result.params.error_message.value);
        this.emitResponse(reqMsgID, undefined, result.value);
        break;

      default:
        this.emitResponse(reqMsgID, { result, headers });
    }

    if (headers.msgID) this.ackMsg(headers.msgID);
  }
}
