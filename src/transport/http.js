// @flow

import TL from '../tl';
import TLConstructor from '../tl/entites/constructor';

export default class Http {
  tl: TL;

  addr: string;

  constructor(addr: string, tlHandler: TL, ssl: boolean = true) {
    this.addr = `http${ssl ? 's' : ''}://${addr}/apiw1`;
    this.tl = tlHandler;
  }

  // eslint-disable-next-line consistent-return
  call(message: TLConstructor | TLMessage | ArrayBuffer, callback?: (TLResponse) => any): Promise {
    const req = new XMLHttpRequest();

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', this.handleError);

    // type TLMessage
    if (message.withHeaders) {
      req.send(message.withHeaders());

    // type TLConstructor
    } else if (message.serialize) {
      req.send(message.serialize());
    } else if (message.byteLength > 0) {
      req.send(message);
    }

    if (callback) {
      req.onload = () => {
        callback(this.tl.response(req.response));
      };
    } else {
      return new Promise((resolve: () => any, reject: () => any) => {
        req.onreadystatechange = () => {
          if (req.readyState !== 4) return;
          if (req.status >= 200 && req.status < 300) {
            resolve(this.tl.response(req.response));
          } else {
            reject();
          }
        };
      });
    }
  }

  static handleError() {}
}
