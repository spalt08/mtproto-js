import { PlainMessage, Message } from '../message';
import Transport from './abstract';
import { Bytes } from '../serialization';
import async from '../crypto/async';

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
  send(msg: PlainMessage | Message) {
    const authKey = this.svc.getAuthKey(this.cfg.dc);
    const { dc, thread } = this.cfg;
    const payload = {
      msg, dc, thread, transport: this.transport, authKey: authKey ? authKey.key : '',
    };

    if (msg instanceof PlainMessage) {
      this.lastNonce = msg.nonce;
    }

    async('transport_encrypt', payload, (data: Bytes) => {
      const req = new XMLHttpRequest();

      req.open('POST', `http${this.cfg.ssl ? 's' : ''}://${this.svc.getHost(this.cfg.dc)}/apiw1${this.cfg.test ? '_test' : ''}`);
      req.responseType = 'arraybuffer';

      req.addEventListener('error', () => {
        this.cfg.resolveError(this.cfg.dc, this.cfg.thread, this.transport, this.lastNonce || '', 0);
      });

      req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status >= 200 && req.status < 300) {
          const buf = new Bytes(req.response);
          const payloadDec = {
            dc, thread, transport: this.transport, authKey: authKey ? authKey.key : '', msg: buf,
          };

          async('transport_decrypt', payloadDec, (resMsg: Message | PlainMessage | Bytes) => {
            if (msg instanceof PlainMessage) {
              this.lastNonce = msg.nonce;
            }

            if (resMsg instanceof Message || resMsg instanceof PlainMessage) {
              this.cfg.resolve(resMsg, {
                dc: this.cfg.dc,
                thread: this.cfg.thread,
                transport: this.transport,
                msgID: resMsg.id,
              });
            } else {
              throw new Error(`Unexpected answer: ${resMsg.hex}`);
            }
          });
        }
      };

      req.send(data.buffer.buffer);
    });
  }
}
