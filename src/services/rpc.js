// @flow

import type { Transport, Message } from '../interfaces';
import type TypeLanguage from '../typeLanguage';
import type TLConstructor from '../typeLanguage/constructor';

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
      msg: Message,
      resolve: (TLConstructor) => any,
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
   * Subscribes callback to message id
   * @param {Message} msg Sent message
   * @param {func} cb Callback function
   */
  subscribe(msg: Message): Promise<TLConstructor> {
    const msgID = msg.getMessageID().toString();

    return new Promise((resolve: (TLConstructor) => any) => {
      this.messages[msgID] = { msg, resolve };
    });
  }

  /**
   * Call callback due to message id
   * @param {string} msg Sent message
   * @param {TLConstructor} responseMsg Response Message
   */
  emit(msgID: string, responseMsg: TLConstructor) {
    if (this.messages[msgID.toString()]) this.messages[msgID].cb(responseMsg);
  }

  reSend(msgID: string) {
    if (this.messages[msgID.toString()]) this.transport.call(this.messages[msgID.toString()].msg);
  }

  /**
   * Processes RPC response messages
   * @param {string} msg Received message
   */
  processMessage(msg: TLConstructor) {
    switch (msg.declaration.predicate) {
      case 'msg_container':
        for (let i = 0; i < msg.params.messages.items.length; i += 1) {
          this.processMessage(msg.params.messages.items[i])
        }
        break;

      case 'message':
        this.processMessage(msg.params.body);
        break;

      case 'new_session_created':
        console.log('rpc: new_session_created', msg);
        //this.transport.setSession(msg.params.unique_id.getHex());
        break;
  
      case 'bad_server_salt':
        console.log('rpc: bad_server_salt', msg);
        this.transport.setServerSalt(msg.params.new_server_salt.getHex());
        this.reSend(msg.params.bad_msg_id.getHex());
        break;

      case 'msgs_ack':
        console.log('rpc: msgs_ack', msg);
        for (let i = 0; i < msg.params.msg_ids.items.length; i += 1) {
          console.log('message_ack', msg.params.msg_ids.items[i].getHex(),
            this.tl.parse(this.messages[msg.params.msg_ids.items[i].getHex().toString()].msg));
        }
        break;

      default:
        console.log('unknown rpc', msg);
        break;
    }
  }
}
