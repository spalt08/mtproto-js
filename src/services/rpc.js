// @flow

import type { Transport } from '../interfaces';
import type { MessageHeaders } from '../serialization';

import TypeLanguage from '../typeLanguage';
import TLConstructor from '../typeLanguage/constructor';
import { Hex, MessageData } from '../serialization';
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
      resolve: ([TLConstructor, MessageHeaders]) => any,
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
   * @returns {Promise} Promise for response
   */
  subscribe(msg: MessageData): Promise<[TLConstructor, MessageHeaders]> {
    const msgID = msg.getMessageID().toString();
    const { predicate, method } = this.tl.parse(msg).declaration;

    log('<- %s #%s seq: %d', predicate || method, msgID, msg.getSequenceNum());

    return new Promise((resolve: ([TLConstructor, MessageHeaders]) => any, reject: (RPCError) => any) => {
      if (predicate === 'msgs_ack') {
        resolve([new TLConstructor(), {}]);
      } else {
        this.messages[msgID] = { msg, resolve, reject };
      }
    });
  }

  /**
   * Call callback due to message id
   * @param {string} msgID Request message identificator
   * @param {[TLConstructor, MessageHeaders]} responseMsg Response Message
   */
  emitResponse(msgID: string | string, response?: [TLConstructor, MessageHeaders], error?: RPCError) {
    if (response) log('-> %s #%s', response[0].declaration.predicate, msgID);

    if (this.messages[msgID]) {
      if (response) this.messages[msgID].resolve(response);
      if (error) this.messages[msgID].reject(error);

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
      this.tl.query('msgs_ack', { msg_ids: msgIDs.map((id) => id.reverseBytes()) }),
    );
  }

  /**
   * Processes RPC response messages
   * @param {[TLConstructor, MessageHeaders]} msg Received message
   */
  processMessage(msg: [TLConstructor, MessageHeaders]) {
    const [res, headers] = msg;

    switch (res.declaration.predicate) {
      case 'msg_container': this.processMessageContainer([res, headers]); break;
      case 'new_session_created': this.processSessionCreated(msg); break;
      case 'bad_server_salt': this.processBadServerSalt(msg); break;
      case 'bad_msg_notification': this.processBadMsgNotification(msg); break;
      case 'msgs_ack': RPCService.processMsgAck(msg); break;
      case 'rpc_result': this.processRPCResult(msg); break;

      default:
        log('unknown %s', res.declaration.predicate);
        break;
    }
  }

  /**
   * Processes: msg_container
   * @param {string} msg Received message
   */
  processMessageContainer(msg: [TLConstructor, MessageHeaders]) {
    log('-> msg_container');

    const [res] = msg;

    for (let i = 0; i < res.params.messages.items.length; i += 1) {
      const item = res.params.messages.items[i];

      this.processMessage([item.params.body, {
        msgID: item.params.msg_id.getHex(true),
        seqNum: item.params.seqno.getValue(),
      }]);
    }
  }

  /**
   * Processes: bad_server_salt
   * @param {string} msg Received message
   */
  processBadServerSalt(msg: [TLConstructor, MessageHeaders]) {
    log('-> bad_server_salt');

    const [res] = msg;
    const msgID = res.params.bad_msg_id.getHex(true);
    const newSalt = res.params.new_server_salt.getHex();

    this.transport.services.session.serverSalt = newSalt;
    this.resend(msgID);
  }

  /**
   * Processes: new_session_created
   * @param {string} msg Received message
   */
  processSessionCreated(msg: [TLConstructor, MessageHeaders]) {
    log('-> new_session_created');

    const [, headers] = msg;
    if (headers.msgID) this.ackMsg(headers.msgID);
  }

  /**
   * Processes: bad_msg_notification
   * @param {string} msg Received message
   */
  processBadMsgNotification(msg: [TLConstructor, MessageHeaders]) {
    const [res] = msg;

    log('-> bad_msg_notification #%s code: %d', res.params.bad_msg_id.getHex(true).toString(), res.params.error_code.getValue());

    return this;
  }

  /**
   * Processes: msgs_ack
   * @param {string} msg Received message
   * @static
   */
  static processMsgAck(msg: [TLConstructor, MessageHeaders]) {
    const [res] = msg;

    log(`-> msgs_ack #${res.params.msg_ids.items.map((i) => i.getHex().toString()).join(', #')}`);
  }

  /**
   * Processes: rpc_result
   * @param {string} msg Received message
   */
  processRPCResult(msg: [TLConstructor, MessageHeaders]) {
    const [res, headers] = msg;
    const { result } = res.params;
    const reqMsgID = res.params.req_msg_id.getHex(true).toString();
    const resMsgHeaders = headers;


    log('<- rpc_result #%s', reqMsgID);

    switch (result.declaration.predicate) {
      case 'rpc_error':
        log('<- rpc_error %d %s', result.params.error_code.getValue(), result.params.error_message.getValue());
        this.emitResponse(reqMsgID, undefined, result.json());
        break;

      default:
        this.emitResponse(reqMsgID, [result, resMsgHeaders]);
    }

    if (headers.msgID) this.ackMsg(headers.msgID);
  }
}
