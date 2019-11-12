/* eslint-disable no-restricted-globals */
import { hex } from '../serialization';
import {
  factorize,
  ecnryptPQ,
  decryptDH,
  encryptDH,
  transportInit,
  transportEncrypt,
  transportDecrypt,
  getPasswordKdf,
} from './async.tasks';
import { PlainMessage, Message } from '../message';

const ctx: Worker = self as any;

// Resolve result
function resolve(task: string, id: string, result: any) {
  ctx.postMessage({ task, id, result });
}

// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
  if (event.data && event.data.id) {
    const { payload, task, id } = event.data;

    switch (task) {
      case 'factorize': {
        const result = factorize(payload);
        resolve(task, id, result);
        break;
      }

      case 'encrypt_pq': {
        const [inner, publicKey] = payload;
        const data = hex(inner);
        const result = ecnryptPQ(data, publicKey);

        resolve(task, id, result);
        break;
      }

      case 'decrypt_dh': {
        const [datahex, nnhex, snhex] = payload;
        const data = hex(datahex);
        const nn = hex(nnhex);
        const sn = hex(snhex);
        const result = decryptDH(data, nn, sn);

        resolve(task, id, result.hex);
        break;
      }

      case 'encrypt_dh': {
        const [datahex, nnhex, snhex] = payload;
        const data = hex(datahex);
        const nn = hex(nnhex);
        const sn = hex(snhex);
        const result = encryptDH(data, nn, sn);

        resolve(task, id, result.hex);
        break;
      }

      case 'transport_init': {
        const result = transportInit(payload.dc, payload.thread, payload.transport, payload.protocol);
        resolve(task, id, result.hex);
        break;
      }

      case 'transport_encrypt': {
        const buf = hex(payload.msg);
        let msg;

        if (buf.slice(0, 8).uint.toString() === '0') {
          msg = new PlainMessage(buf);
        } else {
          msg = new Message(buf);
        }

        const result = transportEncrypt(payload.dc, payload.thread, msg, payload.transport, payload.authKey);
        resolve(task, id, result.hex);
        break;
      }

      case 'transport_decrypt': {
        const buf = hex(payload.msg);
        const result = transportDecrypt(payload.dc, payload.thread, buf, payload.transport, payload.authKey);

        if (result instanceof Message || result instanceof PlainMessage) {
          resolve(task, id, result.buf.hex);
        } else {
          resolve(task, id, result.hex);
        }
        break;
      }

      case 'password_kdf': {
        const {
          salt1, salt2, g, p, srpId, srpB, password,
        } = payload;
        const result = getPasswordKdf(salt1, salt2, g, p, srpId, srpB, password);

        resolve(task, id, result);
        break;
      }

      default:
    }
  }
});

/* For jest testing */
export default class WorkerMock {
  onmessage: undefined | ((event: MessageEvent) => void);

  // eslint-disable-next-line
  constructor() {}

  // eslint-disable-next-line
  postMessage(_msg: any): void {};
}
