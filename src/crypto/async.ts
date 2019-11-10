import AsyncWorker from './async.worker';
import { RSAKey } from './rsa/keys';

/**
 * Worker task callback
 */
type ResponseResolver = (res: any) => void;

const worker = new AsyncWorker();
const quene: Record<string, ResponseResolver> = {};

/**
 * Task register
 */
function async(task: 'factorize', payload: string, cb: (res: string[]) => void): void;
function async(task: 'encrypt_pq', payload: [string, RSAKey], cb: (res: string) => void): void;
function async(task: 'decrypt_dh', payload: string[], cb: (res: string) => void): void;
function async(task: 'encrypt_dh', payload: string[], cb: (res: string) => void): void;
function async(task: 'transport_init', payload: [number, string], cb: (res: string) => void): void;
function async(task: 'transport_encrypt', payload: [number, string, string], cb: (res: string) => void): void;
function async(task: 'transport_decrypt', payload: [number, string, string], cb: (res: [string, string]) => void): void;
function async(task: string, payload: any, cb: ResponseResolver): void {
  const taskID = task + Date.now().toString(16);

  worker.postMessage({
    id: taskID,
    task,
    payload,
  });

  quene[taskID] = cb;
}

/**
 * Task resolver
 */
worker.onmessage = (event: MessageEvent) => {
  if (event.data && event.data.id) {
    quene[event.data.id](event.data.result);
  }
};

export default async;
