import AsyncWorker from './async.worker';
import { RSAKey } from './rsa/keys';
import { Bytes, hex } from '../serialization';
import {
  factorize,
  ecnryptPQ,
  decryptDH,
  encryptDH,
  transportInit,
  transportEncrypt,
  transportDecrypt,
} from './async.tasks';
import { Message, PlainMessage } from '../message';

/**
 * Worker task callback
 */
type TaskResolver = (res: any) => void;

const worker = new AsyncWorker();
const quene: Record<string, TaskResolver> = {};

type TranportInitPayload = { dc: number, thread: number, transport: string, protocol: string };
type TranportEncryptPayload = { dc: number, thread: number, msg: Message | PlainMessage, transport: string, authKey: string };
type TranportDecryptPayload = { dc: number, thread: number, msg: Bytes, transport: string, authKey: string };
/**
 * Task register
 */
function async(task: 'factorize', payload: string, cb: (res: string[]) => void): void;
function async(task: 'encrypt_pq', payload: [Bytes, RSAKey], cb: (res: string) => void): void;
function async(task: 'decrypt_dh', payload: [string, Bytes, Bytes], cb: (res: Bytes) => void): void;
function async(task: 'encrypt_dh', payload: Bytes[], cb: (res: string) => void): void;
function async(task: 'transport_init', payload: TranportInitPayload, cb: (res: Bytes) => void): void;
function async(task: 'transport_encrypt', payload: TranportEncryptPayload, cb: (res: Bytes) => void): void;
function async(task: 'transport_decrypt', payload: TranportDecryptPayload, cb: (res: Message | PlainMessage | Bytes) => void): void;
function async(task: string, payload: any, cb: TaskResolver): void {
  const id = task + Date.now().toString(16);

  switch (task) {
    case 'factorize':
      if (!window.Worker) cb(factorize(payload));
      else worker.postMessage({ id, task, payload });
      break;

    case 'encrypt_pq': {
      const [data, publicKey] = payload;

      if (!window.Worker) cb(ecnryptPQ(data, publicKey));
      else worker.postMessage({ id, task, payload: [data.hex, publicKey] });
      break;
    }

    case 'decrypt_dh': {
      const [data, nn, sn] = payload;

      if (!window.Worker) cb(decryptDH(hex(data), nn, sn));
      else worker.postMessage({ id, task, payload: [data, nn.hex, sn.hex] });
      break;
    }

    case 'encrypt_dh': {
      const [data, nn, sn] = payload;

      if (!window.Worker) cb(encryptDH(data, nn, sn).hex);
      else worker.postMessage({ id, task, payload: [data.hex, nn.hex, sn.hex] });
      break;
    }

    case 'transport_init': {
      const {
        dc, thread, transport, protocol,
      } = payload;

      if (!window.Worker) cb(transportInit(dc, thread, transport, protocol));
      else worker.postMessage({ id, task, payload });
      break;
    }

    case 'transport_encrypt': {
      const {
        dc, thread, msg, transport, authKey,
      } = payload;

      if (!window.Worker) cb(transportEncrypt(dc, thread, msg, transport, authKey));
      else {
        worker.postMessage({
          id,
          task,
          payload: {
            dc, thread, msg: msg.buf.hex, transport, authKey,
          },
        });
      }
      break;
    }

    case 'transport_decrypt': {
      const {
        dc, thread, msg, transport, authKey,
      } = payload;

      if (!window.Worker) cb(transportDecrypt(dc, thread, msg, transport, authKey));
      else {
        worker.postMessage({
          id,
          task,
          payload: {
            dc, thread, msg: msg.hex, transport, authKey,
          },
        });
      }
      break;
    }

    default:
      worker.postMessage({
        id,
        task,
        payload,
      });
  }

  quene[id] = cb;
}

/**
 * Task resolver
 */
worker.onmessage = (event: MessageEvent) => {
  if (!event.data || !event.data.id) return;

  const { data } = event;

  switch (data.task) {
    // call callback with string
    case 'factorize':
    case 'encrypt_pq':
    case 'encrypt_dh':
      quene[data.id](data.result);
      return;

    // call callback with Bytes
    case 'decrypt_dh':
    case 'transport_init':
    case 'transport_encrypt':
      quene[data.id](hex(data.result));
      return;

    case 'transport_decrypt': {
      const buf = hex(data.result);

      if (buf.length <= 8) quene[data.id](buf);
      else if (buf.slice(0, 8).uint.toString() === '0') quene[data.id](new PlainMessage(buf));
      else if (buf.slice(28, 32).int32 <= buf.length - 28) quene[data.id](new Message(buf));
      else quene[data.id](buf);

      return;
    }

    default:
      quene[event.data.id](data.result);
  }
};

export default async;
