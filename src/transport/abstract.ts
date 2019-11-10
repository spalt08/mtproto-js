/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars, no-dupe-class-members */
import TypeLanguage, { TLConstructor, TLAbstract } from '../tl';
import { Message, PlainMessage } from '../message';
import { DCService, AuthService, RPCService } from '../services';

/** Generic error for mtproto transport */
export type TranportError = {
  type: 'rpc' | 'network';
  code: number,
  message?: string,
};

/** Generic callback for mtproto transport request */
export type ResponseCallback = (error: TranportError | null, result?: TLAbstract, headers?: Record<string, any>) => void;

/** Generic config for mtproto transport classes */
export type GenericTranportConfig = {
  APIID?: string,
  APIHash?: string,
  APILayer?: number,
  baseDC?: number,
};

/**
 * Abstract class for all mtproto transport classes
 */
export default class Transport {
  /** Type Language handler */
  tl: TypeLanguage;

  /** API Layer */
  layer: number;

  /** Datacenter service */
  dc: DCService;

  /** Authorization service */
  auth: AuthService;

  /** RPC service */
  rpc: RPCService;

  /** Event listeners */
  events: Record<string, Array<() => void>> = {};

  /**
   * Creates abstract transport object
   * @param {GenericTranportConfig} cfg Generic transport config
   */
  constructor(tl: TypeLanguage, cfg: GenericTranportConfig = {}) {
    this.tl = tl;

    this.layer = cfg.APILayer || 105;

    this.dc = new DCService(cfg.baseDC);
    this.auth = new AuthService(this, this.tl);
    this.rpc = new RPCService(this, this.tl);
  }


  public call(src: TLConstructor | Message, cb: ResponseCallback): void;

  public call(src: TLConstructor | Message, headers: Record<string, any>, cb: ResponseCallback): void;

  public call(method: string, data: Record<string, any>): void;

  public call(method: string, data: Record<string, any>, cb: ResponseCallback): void;

  public call(method: string, data: Record<string, any>, headers: Record<string, any>, cb: ResponseCallback): void;

  public call(src: TLConstructor | Message | string, ...args: unknown[]): void {
    let msg: Message;
    let cb: ResponseCallback = () => {};
    let headers: Record<string, any> = {};
    let isc = true;

    if (src instanceof Message) {
      msg = src;

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as ResponseCallback;
      if (typeof args[1] === 'function') cb = args[1] as ResponseCallback;
    } else if (src instanceof TLConstructor) {
      msg = new Message(src);

      if (src._ === 'msgs_ack' || src._ === 'http_wait') isc = false;

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as ResponseCallback;
      if (typeof args[1] === 'function') cb = args[1] as ResponseCallback;
    } else if (typeof src === 'string') {
      let data: Record<string, any> = {};

      if (typeof args[0] === 'object') data = args[0] as Record<string, any>;

      msg = new Message(
        this.tl.create(src, data),
      );

      if (typeof args[1] === 'object') headers = args[1] as Record<string, any>;
      if (typeof args[1] === 'function') cb = args[1] as ResponseCallback;
      if (typeof args[2] === 'function') cb = args[2] as ResponseCallback;
    } else throw new Error(`Unable to create request with ${src}`);

    if (headers.msgID) msg.id = headers.msgID;
    if (!msg.id) msg.id = PlainMessage.GenerateID();

    if (!headers.dcID) headers.dcID = this.dc.default;

    const dc = headers.dcID;

    msg.salt = this.dc.getSalt(dc);
    msg.sessionID = this.dc.getSessionID(dc);
    msg.seqNo = this.dc.nextSeqNo(dc, isc);

    return this.send(msg, headers, cb);
  }

  public plainCall(src: TLConstructor | PlainMessage, cb: ResponseCallback): void;

  public plainCall(src: TLConstructor | PlainMessage, headers: Record<string, any>, cb: ResponseCallback): void;

  public plainCall(method: string, data: Record<string, any>, cb: ResponseCallback): void;

  public plainCall(method: string, data: Record<string, any>, headers: Record<string, any>, cb: ResponseCallback): void;

  public plainCall(src: TLConstructor | PlainMessage | string, ...args: unknown[]): void {
    let msg: PlainMessage;
    let cb: ResponseCallback = () => {};
    let headers: Record<string, any> = {};

    if (src instanceof PlainMessage) {
      msg = src;

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as ResponseCallback;
      if (typeof args[1] === 'function') cb = args[1] as ResponseCallback;
    } else if (src instanceof TLConstructor) {
      msg = new PlainMessage(src);

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as ResponseCallback;
      if (typeof args[1] === 'function') cb = args[1] as ResponseCallback;
    } else if (typeof src === 'string') {
      let data: Record<string, any> = {};

      if (typeof args[0] === 'object') data = args[0] as Record<string, any>;

      msg = new PlainMessage(
        this.tl.create(src, data),
      );

      if (typeof args[1] === 'object') headers = args[1] as Record<string, any>;
      if (typeof args[1] === 'function') cb = args[1] as ResponseCallback;
      if (typeof args[2] === 'function') cb = args[2] as ResponseCallback;
    } else throw new Error(`Unable to create request with ${src}`);

    if (headers.msgID) msg.id = headers.msgID;
    if (!msg.id) msg.id = PlainMessage.GenerateID();

    return this.send(msg, headers, cb);
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

  send(_msg: PlainMessage | Message, _headers: Record<string, any>, _cb: ResponseCallback) {
    throw new Error('You should overload send method first');
  }
}
