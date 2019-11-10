/* eslint-disable no-restricted-globals */
import BigInt from 'big-integer';
import { BrentPrime } from './pq';
import { Bytes, hex } from '../serialization';
import RSAEncrypt from './rsa/encrypt';
import { decrypt, encrypt } from './aes/ige';
import { encryptMessage, decryptMessage } from './aes/message';
import sha1 from './sha1';
import {
  Obfuscation, Intermediate, IntermediatePadded, Full, Abridged,
} from '../transport/protocol';
import { Message, EncryptedMessage } from '../message';

const ctx: Worker = self as any;

const obfuscation: Record<number, Obfuscation> = {};
const protocol: Record<number, Intermediate | IntermediatePadded | Full | Abridged> = {};

// Resolve result
function resolve(taskID: string, result: any) {
  ctx.postMessage({ id: taskID, result });
}

// Respond to message from parent thread
ctx.addEventListener('message', (event) => {
  if (event.data && event.data.id) {
    const { payload, task, id } = event.data;

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

      case 'transport_init': {
        const [dc, protocolName] = payload;

        switch (protocolName) {
          case 'abridged': protocol[dc] = new Abridged(); break;
          case 'intermediate_padded': protocol[dc] = new IntermediatePadded(); break;
          case 'full': protocol[dc] = new Full(); break;
          default: protocol[dc] = new Intermediate();
        }

        obfuscation[dc] = new Obfuscation();

        resolve(id, obfuscation[dc].init(protocol[dc].header).hex);
        break;
      }

      case 'transport_encrypt': {
        const [dc, data, authKey] = payload;

        const msg = hex(data);

        if (msg.slice(0, 8).uint.toString() === '0') {
          resolve(id, obfuscation[dc].encode(protocol[dc].wrap(hex(data))).hex);
        } else {
          const encrypted = encryptMessage(authKey, new Message(msg));
          resolve(id, obfuscation[dc].encode(protocol[dc].wrap(encrypted.buf)).hex);
        }
        break;
      }

      case 'transport_decrypt': {
        const [dc, encrypted, authKey] = payload;
        const [type, data] = protocol[dc].unWrap(obfuscation[dc].decode(hex(encrypted)));

        if (type === 'plain') {
          resolve(id, [type, data.hex]);
        } else {
          const decrypted = decryptMessage(authKey, new EncryptedMessage(data));
          resolve(id, [type, decrypted.buf.hex]);
        }
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
