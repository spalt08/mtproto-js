/* eslint-disable no-restricted-globals */
import BigInt from 'big-integer';
import { BrentPrime } from './pq';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import RSAEncrypt from './rsa/encrypt';
import { decrypt, encrypt } from './aes/ige';
import sha1 from './sha1';

const log = logs('worker');

// Resolve result
function resolve(taskID, result) {
  self.postMessage({ id: taskID, result });
}

// Respond to message from parent thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.id) {
    const { payload, task, id } = event.data;

    const time = Date.now();

    switch (task) {
      case 'factorize': {
        const [p, q] = BrentPrime(BigInt(payload, 16));
        resolve(id, [p.toString(16), q.toString(16)]);
        break;
      }

      case 'encrypt_pq': {
        const [inner, publicKey] = payload;
        const encryptedPQ = new Bytes(255);
        const data = hex(inner);

        encryptedPQ.slice(0, 20).raw = sha1(data).raw;
        encryptedPQ.slice(20, 20 + data.length).raw = data.raw;
        encryptedPQ.slice(20 + data.length).randomize();

        resolve(id, RSAEncrypt(encryptedPQ.hex, publicKey.n, publicKey.e));
        break;
      }

      case 'decrypt_dh': {
        const [data, newnonce, srvnonce] = payload;

        const tmpAesKey = new Bytes(32);
        const tmpAesIv = new Bytes(32);

        tmpAesKey.slice(0, 20).raw = sha1(hex(newnonce + srvnonce)).raw;
        tmpAesKey.slice(20, 32).raw = sha1(hex(srvnonce + newnonce)).slice(0, 12).raw;

        tmpAesIv.slice(0, 8).raw = sha1(hex(srvnonce + newnonce)).slice(12, 20).raw;
        tmpAesIv.slice(8, 28).raw = sha1(hex(newnonce + newnonce)).raw;
        tmpAesIv.slice(28, 32).raw = hex(newnonce).slice(0, 4).raw;


        resolve(id, decrypt(hex(data), tmpAesKey, tmpAesIv).hex);
        break;
      }

      case 'encrypt_dh': {
        const [data, newnonce, srvnonce] = payload;

        const tmpAesKey = new Bytes(32);
        const tmpAesIv = new Bytes(32);

        tmpAesKey.slice(0, 20).raw = sha1(hex(newnonce + srvnonce)).raw;
        tmpAesKey.slice(20, 32).raw = sha1(hex(srvnonce + newnonce)).slice(0, 12).raw;

        tmpAesIv.slice(0, 8).raw = sha1(hex(srvnonce + newnonce)).slice(12, 20).raw;
        tmpAesIv.slice(8, 28).raw = sha1(hex(newnonce + newnonce)).raw;
        tmpAesIv.slice(28, 32).raw = hex(newnonce).slice(0, 4).raw;


        let len = 20 + data.length / 2;
        len += 16 - (len % 16);

        const plain = new Bytes(len);

        plain.slice(0, 20).raw = sha1(hex(data)).raw;
        plain.slice(20, 20 + data.length / 2).hex = data;
        plain.slice(20 + data.length / 2).randomize();

        resolve(id, encrypt(plain, tmpAesKey, tmpAesIv).hex);
        break;
      }

      default:
    }

    log('task', task, `${((Date.now() - time) / 1000).toFixed(2)}s`);
  }
});

export default {} as {new (): Worker};
