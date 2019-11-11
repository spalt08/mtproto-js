/* eslint-disable lines-between-class-members, no-dupe-class-members, import/no-cycle */
import TypeLanguage, { TLConstructor, TLAbstract } from '../tl';
import { MTProtoTransport } from '../transport/protocol';
import Transport from '../transport/abstract';
import { Http, Socket } from '../transport';
import DCService from './dc';
import { Message, PlainMessage } from '../message';
import { createAuthKey } from './auth';
import RPCService from './rpc';
import { RPCHeaders } from './rpc.types';

/** Generic error for mtproto transport */
export type ClientError = {
  type: 'rpc' | 'network';
  code: number,
  message?: string,
};

/** Client inner callback */
export type ClientCallback = (error: ClientError | null, result?: Message | PlainMessage) => void;

/** Request callback */
export type RequestCallback = (error: ClientError | null, result?: TLAbstract) => void;

type Transports = 'http' | 'websocket';

/** Client configuration type */
export type ClientConfig = {
  test: boolean,
  ssl: boolean,
  dc: number,
  protocol: MTProtoTransport,
  transport: Transports,

  APILayer: number,
  APIID?: string,
  APIHash?: string,
};

/** Default client configuration */
const defaultClientConfig = {
  test: false,
  ssl: true,
  dc: 2,
  protocol: 'intermediate' as MTProtoTransport,
  transport: 'websocket' as Transports,

  APILayer: 105,
};

/**
 * MTProto client
 */
export default class Client {
  /** Type Language handler */
  tl: TypeLanguage;

  /** Client configuration */
  cfg: ClientConfig;

  /** Datacenter service */
  svc: DCService;

  /** RPC service */
  // todo: Client interface to RPC to avoid cycle
  rpc: RPCService;

  /** Connection handlers */
  instances: Transport[];

  /** Quene of response callbacks for plain requests */
  plainResolvers: Record<string, RequestCallback> = {};

  /** Creates new client handler */
  constructor(tl: TypeLanguage, cfg: Record<string, any> = {}) {
    this.tl = tl;
    this.cfg = { ...defaultClientConfig, ...cfg };

    this.svc = new DCService();
    this.rpc = new RPCService(this);

    this.instances = [
      this.createInstance(this.cfg.transport, cfg.dc, 1),
    ];

    const now = Date.now() / 1000;

    createAuthKey(this, cfg.dc, 1, 0, () => console.log((Date.now() / 1000 - now).toFixed(2), 's'));
    // createAuthKey(this, cfg.dc, 2, 3600 * 5, () => console.log((Date.now() / 1000 - now).toFixed(2), 's'));
  }

  /** Create new connection instance */
  createInstance(transport: string, dc: number, thread: number): Transport {
    if (transport === 'websocket') {
      return new Socket(this.svc, {
        ...this.cfg, dc, thread, resolve: this.resolve,
      });
    }

    return new Http(this.svc, {
      ...this.cfg, dc, thread, resolve: this.resolve,
    });
  }

  /** Gets connection instance */
  getInstance(transport: string, dc: number, thread: number): Transport {
    for (let i = 0; i < this.instances.length; i += 1) {
      if (this.instances[i].cfg.dc === dc && this.instances[i].cfg.thread === thread && this.instances[i].transport === transport) {
        return this.instances[i];
      }
    }

    const newi = this.createInstance(transport, dc, thread);

    this.instances.push(newi);

    return newi;
  }

  /** Resolve response message */
  resolve = (msg: Message | PlainMessage, headers: RPCHeaders) => {
    const result = this.tl.parse(msg.data);

    if (msg instanceof PlainMessage) {
      if (msg.nonce && this.plainResolvers[msg.nonce]) this.plainResolvers[msg.nonce](null, result);
      return;
    }

    this.rpc.processMessage(result, headers);
  };

  /** Create plain message and send it to the server */
  public plainCall(src: TLConstructor | PlainMessage, cb: RequestCallback): void;
  public plainCall(src: TLConstructor | PlainMessage, headers: Record<string, any>, cb: RequestCallback): void;
  public plainCall(method: string, data: Record<string, any>, cb: RequestCallback): void;
  public plainCall(method: string, data: Record<string, any>, headers: Record<string, any>, cb: RequestCallback): void;
  public plainCall(src: TLConstructor | PlainMessage | string, ...args: unknown[]): void {
    let msg: PlainMessage;
    let cb: RequestCallback;
    let headers: Record<string, any> = {};

    if (src instanceof PlainMessage) {
      msg = src;

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as RequestCallback;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
    } else if (src instanceof TLConstructor) {
      msg = new PlainMessage(src);

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as RequestCallback;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
    } else if (typeof src === 'string') {
      let data: Record<string, any> = {};

      if (typeof args[0] === 'object') data = args[0] as Record<string, any>;

      msg = new PlainMessage(
        this.tl.create(src, data),
      );

      if (typeof args[1] === 'object') headers = args[1] as Record<string, any>;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
      if (typeof args[2] === 'function') cb = args[2] as RequestCallback;
    } else throw new Error(`Unable to create request with ${src}`);

    if (headers.msgID) msg.id = headers.msgID;
    if (!msg.id) msg.id = PlainMessage.GenerateID();

    const dc = headers.dc || this.cfg.dc;
    const thread = headers.thread || 1;
    const transport = headers.transport || this.cfg.transport;

    // Resolve plain message
    if (msg instanceof PlainMessage && cb!) {
      this.plainResolvers[msg.nonce] = cb!;
    }

    this.getInstance(transport, dc, thread).send(msg);
  }

  /** Create message, encrypt it and send it to the server */
  public call(src: TLConstructor | Message, cb: RequestCallback): void;
  public call(src: TLConstructor | Message, headers: Record<string, any>, cb: RequestCallback): void;
  public call(method: string, data: Record<string, any>): void;
  public call(method: string, data: Record<string, any>, cb: RequestCallback): void;
  public call(method: string, data: Record<string, any>, headers: Record<string, any>): void;
  public call(method: string, data: Record<string, any>, headers: Record<string, any>, cb: RequestCallback): void;
  public call(src: TLConstructor | Message | string, ...args: unknown[]): void {
    let msg: Message;
    let cb: RequestCallback | undefined;
    let headers: Record<string, any> = {};
    let isc = true;

    if (src instanceof Message) {
      msg = src;

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as RequestCallback;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
    } else if (src instanceof TLConstructor) {
      msg = new Message(src);

      if (src._ === 'msgs_ack' || src._ === 'http_wait') isc = false;

      if (typeof args[0] === 'object') headers = args[0] as Record<string, any>;
      if (typeof args[0] === 'function') cb = args[0] as RequestCallback;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
    } else if (typeof src === 'string') {
      let data: Record<string, any> = {};

      if (typeof args[0] === 'object') data = args[0] as Record<string, any>;

      msg = new Message(
        this.tl.create(src, data),
      );

      if (typeof args[1] === 'object') headers = args[1] as Record<string, any>;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
      if (typeof args[2] === 'function') cb = args[2] as RequestCallback;
    } else throw new Error(`Unable to create request with ${src}`);

    if (headers.msgID) msg.id = headers.msgID;
    if (!msg.id) msg.id = PlainMessage.GenerateID();

    const dc = headers.dc || this.cfg.dc;
    const thread = headers.thread || 1;
    const transport = headers.transport || this.cfg.transport;

    msg.salt = this.svc.getSalt(dc);
    msg.sessionID = this.svc.getSessionID(dc);
    msg.seqNo = this.svc.nextSeqNo(dc, isc);

    this.rpc.subscribe(msg, {
      dc, thread, transport, msgID: msg.id,
    }, cb);

    this.getInstance(transport, dc, thread).send(msg);
  }
}
