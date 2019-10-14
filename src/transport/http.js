// @flow

import type { Transport, Message } from '../interfaces';
import type { GenericTranportConfig } from './abstract';
import type { MessageHeaders } from '../serialization';

import TypeLanguage from '../typeLanguage';
import AbstractTransport from './abstract';
import TLConstructor from '../typeLanguage/constructor';
import { MessagePlain, MessageData, MessageEncrypted } from '../serialization';
import { encryptDataMessage, decryptDataMessage } from '../crypto/aes/message';
import { AuthService } from '../services';
import { logs } from '../utils/log';

const log = logs('http');

/** Function wraps response into type language constructor */
type ResponseWrapper = (ArrayBuffer, TypeLanguage, { auth: AuthService }) => [TLConstructor, MessageHeaders];

/** Configuration object for HTTP transport */
type HTTPConfig = GenericTranportConfig & {
  ssl?: boolean,
};

/** Default configuration for HTTP transport */
const defaultConfig = {
  ssl: true,
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
  constructor(addr: string, tl: TypeLanguage, extCfg?: HTTPConfig) {
    super(tl, extCfg);

    const cfg: HTTPConfig = { ...defaultConfig, ...extCfg };

    this.addr = `http${cfg.ssl ? 's' : ''}://${addr}/apiw1`;
  }

  async connect() {
    await this.services.auth.prepare();
    await this.services.session.prepare();
    log('ready');
  }

  /**
   * Method ecnrypts serialized message and sends it to the server
   * @param {TLConstructor | Message} query Data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders} headers Optional message headers
   * @returns {Promise<[TLConstructor, MessageHeaders]>} Promise response wrapped by type language constructor
   */
  call(query: TLConstructor | Message, headers?: MessageHeaders = {}): Promise<[TLConstructor, MessageHeaders]> {
    let msg = new MessageData();

    if (query instanceof MessageData) {
      msg = query;
    } else if (query instanceof TLConstructor) {
      const isContentRelated = query.declaration.predicate !== 'msgs_ack';

      msg = new MessageData(query.serialize())
        .setSessionID(headers.sessionID || this.services.session.sessionID)
        .setSalt(headers.serverSalt || this.services.session.serverSalt)
        .setMessageID(headers.msgID)
        .setSequenceNum(headers.seqNum || this.services.session.nextSeqNum(isContentRelated))
        .setLength()
        .setPadding();
    }

    this.send(encryptDataMessage(this.services.auth.tempKey, msg), Http.WrapEncryptedResponse).then(
      (res: [TLConstructor, MessageHeaders]) => this.services.rpc.processMessage(res),
    );

    return this.services.rpc.subscribe(msg);
  }

  /**
   * Method sends plain message to the server
   * @param {TLConstructor | Message} query Data to send, wrapped at tl constructor or generic buffer
   * @param {MsgHeaders} headers Optional message headers
   * @returns {Promise<TLConstructor>} Promise response wrapped by type language constructor
   */
  callPlain(query: TLConstructor | Message, headers?: MessageHeaders = {}): Promise<[TLConstructor, MessageHeaders]> {
    if (query instanceof MessagePlain) {
      return this.send(query, Http.WrapPlainResponse);
    }

    const msg = new MessagePlain(query instanceof TLConstructor ? query.serialize() : undefined)
      .setMessageID(headers.msgID)
      .setLength();

    return this.send(msg, Http.WrapPlainResponse);
  }

  /**
   * Method sends bytes to server via http.
   * @param {Message} msg Message interface
   * @param {ResponseWrapper} rw Response wrapper function
   * @param {boolean} isPlain is plain message
   * @returns {Promise} If callback wasn't set
   */
  send(msg: MessagePlain | MessageEncrypted, rw?: ResponseWrapper = Http.WrapEncryptedResponse): Promise<[TLConstructor, MessageHeaders]> {
    const req = new XMLHttpRequest();

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', this.handleError);
    req.send(msg.getBuffer());

    return new Promise((resolve: ([TLConstructor, MessageHeaders]) => any, reject) => {
      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 300) {
          resolve(rw(req.response, this.tl, this.services));
        } else {
          const err = new Error(`HTTP Error: Unexpected status ${req.status}`);
          reject(err);
        }
      };
    });
  }

  /**
   * Method decrypts response message and wraps it into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   * @static
   */
  static WrapEncryptedResponse(buf: ArrayBuffer, tl: TypeLanguage, services: { auth: AuthService }): [TLConstructor, MessageHeaders] {
    const msg = new MessageEncrypted(buf);
    const decryptedMsg = decryptDataMessage(services.auth.tempKey, msg);

    return [tl.parse(decryptedMsg), { msgID: decryptedMsg.getMessageID() }];
  }

  /**
   * Method wraps response bytes into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   * @static
   */
  static WrapPlainResponse(buf: ArrayBuffer, tl: TypeLanguage): [TLConstructor, MessageHeaders] {
    const msg = new MessagePlain(buf);

    return [tl.parse(msg), { msgID: msg.getMessageID() }];
  }

  /**
   * Method handles XMLHttpRequest erros
   */
  handleError = () => { throw new Error('HTTP Error'); };
}
