// @flow

import type { Transport, Message } from '../interfaces';
import type TypeLanguage from '../typeLanguage';
import type { GenericTranportConfig } from './abstract';
import type { Hex } from '../serialization';

import AbstractTransport from './abstract';
import TLConstructor from '../typeLanguage/constructor';
import { MessagePlain, MessageData, MessageEncrypted } from '../serialization';
import { encryptDataMessage, decryptDataMessage } from '../crypto/aes/message';
import AuthService from '../services/auth';

/** Function wraps response into type language constructor */
type ResponseWrapper = (ArrayBuffer, TypeLanguage, ?{ auth: AuthService }) => TLConstructor;

/** Configuration object for HTTP transport */
type HTTPConfig = GenericTranportConfig & {
  ssl?: boolean,
};

/** Default configuration for HTTP transport */
const defaultConfig = {
  ssl: true,
};

/** Message headers object type */
type MsgHeaders = {
  sessionID?: Hex | string,
  serverSalt?: Hex | string,
  msgID?: Hex | string,
  seqNum?: number,
};

/**
 * Http is a wrapper for XMLHttpRequest for sending serialized type language messages to HTTP MTProto server.
 * @extends {AbstractTransport}
 */
export default class Http extends AbstractTransport implements Transport {
  /**
   * @param {string} addr Full server address
   */
  addr: string;

  /**
   * Creates HTTP handler for MTProto server.
   * @param {string} addr Server address or IP
   * @param {TypeLanguage} tl Type language handler
   * @param {object} cfg Transport Configuration
   */
  constructor(addr: string, tl: TypeLanguage, extCfg?: HTTPConfig = {}) {
    super(tl, extCfg);

    const cfg = { ...defaultConfig, ...extCfg };

    this.addr = `http${cfg.ssl ? 's' : ''}://${addr}/apiw1`;
  }

  /**
   * Method ecnrypts serialized message and sends it to the server
   * @param {TLConstructor | Message} query Data to send, wrapped at tl constructor or generic buffer
   * @returns {Promise<TLConstructor>} Promise response wrapped by type language constructor
   */
  call(query: TLConstructor | MessageData, headers: MsgHeaders = {}): Promise<TLConstructor> {
    let msg: MessageData;

    if (query instanceof TLConstructor) {
      msg = new MessageData(query.serialize());

      msg.setSessionID(headers.sessionID || this.services.session.id);
      msg.setSalt(headers.serverSalt || this.services.session.serverSalt);
      msg.setMessageID(headers.msgID);
      msg.setSequenceNum(headers.seqNum);
      msg.setLength();
      msg.setPadding();
    } else if (query instanceof MessageData) {
      msg = query;
    }

    this.send(encryptDataMessage(this.services.auth.tempKey, msg), Http.WrapEncryptedResponse).then(
      (res: TLConstructor) => this.services.rpc.processMessage(res),
    );

    return this.services.rpc.subscribe(msg);
  }

  /**
   * Method sends plain message to the server
   * @param {TLConstructor | Message} query Data to send, wrapped at tl constructor or generic buffer
   * @returns {Promise<TLConstructor>} Promise response wrapped by type language constructor
   */
  callPlain(query: TLConstructor | MessagePlain, headers: MsgHeaders = {}): Promise<TLConstructor> {
    if (query instanceof MessagePlain) {
      return this.send(query, Http.WrapPlainResponse);
    }

    const msg = new MessagePlain(query.serialize());

    msg.setMessageID(headers.msgID);
    msg.setLength();

    return this.send(msg, Http.WrapPlainResponse);
  }

  /**
   * Method sends bytes to server via http.
   * @param {Message} msg Message interface
   * @param {ResponseWrapper} rw Response wrapper function
   * @param {boolean} isPlain is plain message
   * @returns {Promise} If callback wasn't set
   */
  send(msg: Message, rw?: ResponseWrapper = Http.WrapEncryptedResponse): Promise<TLConstructor> {
    const req = new XMLHttpRequest();

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', this.handleError);
    req.send(msg.getBuffer());

    return new Promise((resolve: (TLConstructor) => any, reject) => {
      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 300) {
          resolve(rw(req.response, this.tl, this.services));
        } else {
          const err = new Error(`HTTP Error: Unexpected status ${req.status}`);
          reject(err);
          throw err;
        }
      };
    });
  }

  /**
   * Method decrypts response message and wraps it into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   * @static
   */
  static WrapEncryptedResponse(buf: ArrayBuffer, tl: TypeLanguage, services: { auth: AuthService }): TLConstructor {
    const msg = new MessageEncrypted(buf);
    const decryptedMsg = decryptDataMessage(services.auth.tempKey, msg);

    return tl.parse(decryptedMsg);
  }

  /**
   * Method wraps response bytes into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   * @static
   */
  static WrapPlainResponse(buf: ArrayBuffer, tl: TypeLanguage): TLConstructor {
    const msg = new MessagePlain(buf);

    return tl.parse(msg);
  }

  /**
   * Method handles XMLHttpRequest erros
   */
  handleError = () => { throw new Error('HTTP Error'); };
}
