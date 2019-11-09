import { PlainMessage, EncryptedMessage } from '../message';
import TypeLanguage from '../tl';
import Transport, { GenericTranportConfig, ResponseCallback } from './abstract';
import { logs } from '../utils/log';
import { Bytes } from '../serialization';

const log = logs('http');

/** Configuration object for HTTP transport */
type HTTPConfig = GenericTranportConfig & {
  ssl?: boolean,
};

/** Default configuration for HTTP transport */
const defaultConfig = {
  APILayer: 105,
  ssl: true,
};

/**
 * Http is a wrapper for XMLHttpRequest for sending serialized type language messages to HTTP MTProto server.
 * @extends Transport
 */
export default class Http extends Transport {
  addr: string;

  /**
   * Creates HTTP handler for MTProto server.
   */
  constructor(tl: TypeLanguage, extCfg?: HTTPConfig) {
    super(tl, extCfg);

    const cfg: HTTPConfig = { ...defaultConfig, ...extCfg };

    this.addr = `http${cfg.ssl ? 's' : ''}://venus.web.telegram.org/apiw1`;
  }

  /**
   * Method sends bytes to server via http.
   */
  send(msg: PlainMessage | EncryptedMessage, cb: ResponseCallback) {
    const req = new XMLHttpRequest();

    if (msg instanceof PlainMessage) {
      log('-> plain sent', msg.id);
    }

    if (msg instanceof EncryptedMessage) {
      log('-> encrypted sent', msg.key);
    }

    req.open('POST', this.addr);
    req.responseType = 'arraybuffer';
    req.addEventListener('error', (error: ProgressEvent) => {
      cb({
        type: 'network',
        code: 0,
        message: `Unexpected error ${error}`,
      });
    });
    req.onreadystatechange = () => {
      if (req.readyState !== 4) return;
      if (req.status >= 200 && req.status < 300) {
        const buf = new Bytes(req.response);
        const authKey = buf.slice(0, 8).uint;

        if (authKey.toString() === '0') {
          try {
            const resMsg = new PlainMessage(buf);
            const result = this.tl.parse(resMsg.data);

            log('<- plain received', resMsg.id);

            cb(null, result, {
              msgID: resMsg.id,
            });
          } catch (e) {
            cb({
              type: 'network',
              code: 0,
              message: `Serialization error: ${e}`,
            });
          }
        } else {
          const resMsg = new EncryptedMessage(buf);

          log('<- encrypted received', resMsg.key);

          console.log(resMsg);
        }
      } else {
        cb({
          type: 'network',
          code: req.status,
          message: `Unexpected status ${req.status}`,
        });
      }
    };

    req.send(msg.buf.buffer.buffer);
  }
}
