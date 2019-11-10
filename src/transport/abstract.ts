/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars */
import { Message, PlainMessage } from '../message';
import { DCService, ClientCallback } from '../client';

/** Generic config for mtproto transport classes */
export type TransportConfig = {
  dc: number,
  thread: number,
  test: boolean,
  ssl: boolean,
  resolve: (dc: number, thread: number, res: Message | PlainMessage) => void,
};

/**
 * Abstract class for all mtproto transport classes
 */
export default class Transport {
  /** Datacenter service */
  svc: DCService;

  /** Transport config */
  cfg: TransportConfig;

  /** Event listeners */
  events: Record<string, Array<() => void>> = {};

  /**
   * Creates abstract transport object
   */
  constructor(svc: DCService, cfg: TransportConfig) {
    this.svc = svc;
    this.cfg = cfg;
  }

  /**
   * Subscribe to transport event
   */
  on(event: string, cb: () => void): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(cb);
  }

  /**
   * Emit transport event
   */
  emit(event: string): void {
    if (this.events[event]) {
      for (let i = 0; i < this.events[event].length; i += 1) {
        this.events[event][i]();
      }
    }
  }

  send(_msg: PlainMessage | Message, _cb?: ClientCallback) {
    throw new Error('You should overload send method first');
  }
}
