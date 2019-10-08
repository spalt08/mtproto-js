// @flow

import TypeLanguage from '../typeLanguage';
import TLConstructor from '../typeLanguage/constructor';

/**
 * Http is a wrapper for XMLHttpRequest for sending type language queries and serialized messages.
 */
export default class Http {
  /** Type Language handler */
  tl: TypeLanguage;

  /** Full server address */
  addr: string;

  /**
   * Creates http handler.
   * @param {string} addr Server address or IP
   * @param {TypeLanguage} tlHandler Type language handler
   * @param {boolean} ssl Flag for ssl encryption
   * @constructs
   */
  constructor(addr: string, tlHandler: TypeLanguage, ssl: boolean = true) {
    this.addr = `http${ssl ? 's' : ''}://${addr}/apiw1`;
    this.tl = tlHandler;
  }

  /**
   * Method sends bytes to server via http.
   * @param {ArrayBuffer} message Byte array
   * @param {func} callback Optional callback function
   * @returns {Promise} If callback wasn't set
   */
  call(message: ArrayBuffer, callback?: (TLConstructor) => any): ?Promise {
    const req = new XMLHttpRequest();

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', this.handleError);
    req.send(message);

    if (callback) {
      req.onload = () => {
        callback(Http.WrapResponse(req.response));
      };

      return null;
    }

    return new Promise((resolve: () => any, reject: () => any) => {
      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 300) {
          resolve(Http.WrapResponse(req.response));
        } else {
          reject();
        }
      };
    });
  }

  /**
   * @static
   * Method wraps response bytes into tl construtor
   * @param {ArrayBuffer} buf Response bytes
   */
  static WrapResponse(buf: ArrayBuffer) {
    return buf;
  }
}
