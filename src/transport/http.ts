import { PlainMessage, Message, EncryptedMessage } from '../message';
import Transport from './abstract';
import { Bytes } from '../serialization';
import { encryptMessage, decryptMessage } from '../crypto/aes/message';
import { logs } from '../utils/log';

const log = logs('socket');

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

    let frame: ArrayBuffer;

    if (msg instanceof PlainMessage) {
      this.lastNonce = msg.nonce;
      frame = msg.buf.buffer.buffer;
    } else {
      if (!authKey) throw new Error('Trying to send encrypted message without auth key');

      const encrypted = encryptMessage(authKey.key, msg);
      frame = encrypted.buf.buffer.buffer;
    }

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
        let resMsg: PlainMessage | Message | EncryptedMessage;

        // plain message
        if (buf.slice(0, 8).uint === '0000000000000000') {
          resMsg = new PlainMessage(buf);
          this.lastNonce = resMsg.nonce;
        } else {
          if (!authKey) throw new Error('Unable to descrpt message without auth key');

          resMsg = new EncryptedMessage(buf);

          try {
            resMsg = decryptMessage(authKey.key, resMsg);
          } catch (e) {
            log(this.cfg.dc, 'failed to decrypt message');
          }
        }

        if (resMsg instanceof Message || resMsg instanceof PlainMessage) {
          this.cfg.resolve(resMsg, {
            dc: this.cfg.dc,
            thread: this.cfg.thread,
            transport: this.transport,
            msgID: resMsg.id,
          });
        } else {
          throw new Error(`Unexpected answer: ${resMsg.buf.hex}`);
        }
      }
    };

    req.send(frame);
  }
}
