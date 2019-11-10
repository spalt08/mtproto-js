import { PlainMessage, Message } from '../message';
import Transport from './abstract';
import { Bytes } from '../serialization';

/**
 * Http is a wrapper for XMLHttpRequest for sending serialized type language messages to HTTP MTProto server.
 * @extends Transport
 */
export default class Http extends Transport {
  /**
   * Method sends bytes to server via http.
   */
  send(msg: PlainMessage | Message) {
    const req = new XMLHttpRequest();

    req.open('POST', `http${this.cfg.ssl ? 's' : ''}://${this.svc.getHost(this.cfg.dc)}/apiw1${this.cfg.test ? '_test' : ''}`);
    req.responseType = 'arraybuffer';

    // req.addEventListener('error', (error: ProgressEvent) => {
    //   // todo something
    // });

    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;
      if (req.status >= 200 && req.status < 300) {
        const buf = new Bytes(req.response);

        const authKey = buf.slice(0, 8).uint;

        if (authKey.toString() === '0') {
          const res = new PlainMessage(buf);
          this.cfg.resolve(this.cfg.dc, this.cfg.thread, res);
        } else {
          const res = new Message(buf);
          this.cfg.resolve(this.cfg.dc, this.cfg.thread, res);
        }
      } else {
        // todo something
      }
    };

    req.send(msg.buf.buffer.buffer);
  }
}
