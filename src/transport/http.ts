import {
  PlainMessage, EncryptedMessage, bytesToMessage, ErrorMessage,
} from '../message';
import Transport from './abstract';
import { Bytes } from '../serialization';

/**
 * Http is a wrapper for XMLHttpRequest for sending serialized type language messages to HTTP MTProto server.
 * @extends Transport
 */
export default class Http extends Transport {
  /** Instance transport */
  transport = 'http';

  /** Last plain message nonce */
  lastNonce: string | null = null;

  /**
   * Method sends bytes to server via http.
   */
  send(msg: PlainMessage | EncryptedMessage) {
    const frame = msg.buf.buffer.buffer;
    const req = new XMLHttpRequest();

    req.open('POST', `http${this.cfg.ssl ? 's' : ''}://${this.cfg.host}/apiw1${this.cfg.test ? '_test' : ''}`);
    req.responseType = 'arraybuffer';

    // todo: error handling
    // req.addEventListener('error', () => {
    //   this.pass(this.cfg, 0);
    // });

    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;
      if (req.status >= 200 && req.status < 300) {
        const buf = new Bytes(req.response);
        const resMsg = bytesToMessage(buf);

        this.pass(this.cfg, resMsg);
      }

      if (req.status === 404) {
        const resMsg = new ErrorMessage('53feffff');

        this.pass(this.cfg, resMsg);
      }
    };

    req.send(frame);
  }
}
