// @flow

import type { Transport, Message } from '../interfaces';
import type { TLConstructor } from '../typeLanguage/constructor';
import type { TransportConfig } from './configuration';
import TypeLanguage from '../typeLanguage';
import AbstractTransport from './abstract';
import { MessagePlain, MessageData, MessageEncrypted } from '../serialization';
import { encryptDataMessage, decryptDataMessage } from '../crypto/aes/message';
import AuthService from '../services/auth';

type Callback = (TLConstructor) => any;
type ResponseWrapper = (ArrayBuffer) => TLConstructor;

/**
 * Http is a wrapper for XMLHttpRequest for sending type language queries and serialized messages.
 */
export default class Http extends AbstractTransport implements Transport {
  /** Full server address */
  addr: string;

  /**
   * Creates http handler.
   * @param {string} addr Server address or IP
   * @param {TypeLanguage} tlHandler Type language handler
   * @param {boolean} ssl Flag for ssl encryption
   * @param {TransportConfig} cfg Transport Configuration
   * @constructs
   */
  constructor(addr: string, tlHandler: TypeLanguage, cfg?: TransportConfig = {}, ssl: boolean = true) {
    super(tlHandler, cfg);

    this.addr = `http${ssl ? 's' : ''}://${addr}/apiw1`;
    this.tl = tlHandler;
  }

  /**
   * Method sends encrypted message
   * @param {TLConstructor | Message} query Data to send
   * @param {func} callback Optional callback function
   * @returns {Promise} If callback wasn't set
   */
  call(query: TLConstructor | Message, cb?: Callback): ?Promise {
    let msg;

    if (query.serialize) {
      msg = new MessageData(query.serialize());
      msg.setSessionID(this.services.session.getSessionID());
      msg.setSalt(this.services.session.getServerSalt());
      msg.setMessageID();
      msg.setSequenceNum(1);
      msg.setLength();
      msg.setPadding();
    } else if (query.getBuffer) {
      msg = query;
    }

    console.log('session id:', this.services.session.getSessionID());
    this.send(encryptDataMessage(this.services.auth.getAuthKeyTemp(), msg), Http.WrapEncryptedResponse);

    if (cb) {
      this.services.rpc.subscribe(msg, cb);
    } else {
      return new Promise((resolve: () => any) => {
        this.services.rpc.subscribe(msg, resolve);
      });
    }

    return undefined;
  }

  /**
   * Method sends plain (unencrypted) message
   * @param {TLConstructor | MessagePlain} query Data to send
   * @param {func} callback Optional callback function
   * @returns {Promise} If callback wasn't set
   */
  callPlain(query: TLConstructor | MessagePlain, cb?: Callback): ?Promise {
    if (query.getBuffer) return this.send(query.getBuffer, Http.WrapPlainResponse);

    const msg = new MessagePlain(query.serialize());

    msg.setMessageID();
    msg.setLength();

    return this.send(msg, Http.WrapPlainResponse, true, cb);
  }

  /**
   * Method sends bytes to server via http.
   * @param {ArrayBuffer} message Byte array
   * @param {func} callback Optional callback function
   * @returns {Promise} If callback wasn't set
   */
  send(msg: Message, rw?: ResponseWrapper = Http.WrapEncryptedResponse, isPlain?: boolean = false, cb?: Callback): ?Promise {
    const req = new XMLHttpRequest();

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', this.handleError);
    req.send(msg.getBuffer());

    // Encrypted Messages goes through rpc servce
    if (!isPlain) {
      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 300) {
          this.services.rpc.processMessage(rw(req.response, this.tl, this.services));
        } else {
          throw new Error(`HTTP Error: Unexpected status ${req.status}`);
        }
      };

    // Plain Messages requires direct callback
    } else if (cb) {
      req.onload = () => cb(rw(req.response, this.tl, this.services));
    } else {
      return new Promise((resolve) => {
        req.onload = () => resolve(rw(req.response, this.tl, this.services));
      });
    }

    return undefined;
  }

  /**
   * @static
   * Method wraps encrypted response messae into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   */
  static WrapEncryptedResponse(buf: ArrayBuffer, tl: TypeLanguage, services: { auth: AuthService }) {
    const msg = new MessageEncrypted(buf);
    const decryptedMsg = decryptDataMessage(services.auth.getAuthKeyTemp(), msg);

    return tl.parse(decryptedMsg);
  }

  /**
   * @static
   * Method wraps response bytes into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   */
  static WrapPlainResponse(buf: ArrayBuffer, tl: TypeLanguage) {
    const msg = new MessagePlain(buf);

    return tl.parse(msg);
  }
}
