// @flow

import type {
  Transport, Message, TLAny, RPCResult,
} from '../interfaces';
import type { GenericTranportConfig } from './abstract';
import type { MessageHeaders } from '../serialization';

import TypeLanguage from '../tl';
import AbstractTransport from './abstract';
import TLConstructor from '../tl/constructor';
import { MessagePlain, MessageData, MessageEncrypted } from '../serialization';
import { encryptDataMessage, decryptDataMessage } from '../crypto/aes/message';
import { AuthService } from '../services';
import { logs } from '../utils/log';

const log = logs('http');

/** Function wraps response into type language constructor */
type ResponseWrapper = (ArrayBuffer, TypeLanguage, { auth: AuthService }) => RPCResult;

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
  /** Full server address */
  addr: string;

  /** Is Http request pending */
  isConnected: boolean = false;

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
    await this.auth.prepare();
    await this.session.prepare();
    await this.updates.prepare();
    log('ready');
  }

  /**
   * Method ecnrypts serialized message and sends it to the server
   * @param {TLConstructor | Message | string} query Constructor number or data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders | Object} args Constructor data or message headers
   * @param {MessageHeaders} args Message headers
   * @returns {Promise<RPCResult>} Promise response wrapped by type language constructor
   */
  call(query: TLAny | Message | string, args?: MessageHeaders | Object = {}, aargs: MessageHeaders = {}): Promise<RPCResult> {
    let msg = new MessageData();
    let tlHandler = query;
    let headers = aargs;

    if (query instanceof MessageData) {
      msg = query;
    } else if (typeof query === 'string') {
      tlHandler = this.tl.create(query, args);
      headers = aargs;
    } else if (tlHandler instanceof TLConstructor) {
      headers = args;
    }

    if (tlHandler instanceof TLConstructor) {
      const isContentRelated = tlHandler._ !== 'msgs_ack';

      msg = new MessageData(tlHandler.serialize())
        .setSessionID(headers.sessionID || this.session.sessionID)
        .setSalt(headers.serverSalt || this.session.serverSalt)
        .setMessageID(headers.msgID)
        .setSequenceNum(headers.seqNum || this.session.nextSeqNum(isContentRelated))
        .setLength()
        .setPadding();
    }

    this.send(encryptDataMessage(this.auth.tempKey, msg), Http.WrapEncryptedResponse).then(
      (response: RPCResult) => this.rpc.processMessage(response).then(
        () => !this.isConnected && this.call('http_wait', {
          max_delay: 5000,
          wait_after: 5000,
          max_wait: 5000,
        }),
      ),
    );

    return this.rpc.subscribe(msg);
  }

  /**
   * Method sends plain message to the server
   * @param {TLConstructor | Message | string} query Constructor number or data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders | Object} args Constructor data or message headers
   * @param {MessageHeaders} args Message headers
   * @returns {Promise<RPCResult>} Promise response wrapped by type language constructor
   */
  callPlain(query: TLAny | Message | string, args?: MessageHeaders | Object = {}, aargs: MessageHeaders = {}): Promise<RPCResult> {
    let tlHandler = query;
    let msg = new MessagePlain();
    let headers = aargs;

    if (query instanceof MessagePlain) {
      msg = query;
    } else if (typeof query === 'string') {
      tlHandler = this.tl.create(query, args);
      headers = aargs;
    } else if (tlHandler instanceof TLConstructor) {
      headers = args;
    }

    if (tlHandler instanceof TLConstructor) {
      msg = new MessagePlain(tlHandler.serialize())
        .setMessageID(headers.msgID)
        .setLength();
    }

    return this.send(msg, Http.WrapPlainResponse);
  }

  /**
   * Method sends bytes to server via http.
   * @param {Message} msg Message interface
   * @param {ResponseWrapper} rw Response wrapper function
   * @param {boolean} isPlain is plain message
   * @returns {Promise} If callback wasn't set
   */
  send(msg: MessagePlain | MessageEncrypted, rw?: ResponseWrapper = Http.WrapEncryptedResponse): Promise<RPCResult> {
    const req = new XMLHttpRequest();

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', this.handleError);
    req.send(msg.getBuffer());

    this.isConnected = true;

    return new Promise((resolve: (RPCResult) => any, reject) => {
      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 300) {
          this.isConnected = false;
          resolve(rw(req.response, this.tl, { auth: this.auth }));
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
  static WrapEncryptedResponse(buf: ArrayBuffer, tl: TypeLanguage, services: { auth: AuthService }): RPCResult {
    const msg = new MessageEncrypted(buf);
    const decryptedMsg = decryptDataMessage(services.auth.tempKey, msg);

    return { result: tl.parse(decryptedMsg), headers: { msgID: decryptedMsg.getMessageID() } };
  }

  /**
   * Method wraps response bytes into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   * @static
   */
  static WrapPlainResponse(buf: ArrayBuffer, tl: TypeLanguage): RPCResult {
    const msg = new MessagePlain(buf);

    return { result: tl.parse(msg), headers: { msgID: msg.getMessageID() } };
  }

  /**
   * Method handles XMLHttpRequest erros
   */
  handleError = () => { throw new Error('HTTP Error'); };
}
