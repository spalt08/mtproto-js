/* eslint-disable lines-between-class-members, no-dupe-class-members, import/no-cycle */
import BigInt from 'big-integer';
import TypeLanguage, { TLConstructor, TLAbstract } from '../tl';
import { MTProtoTransport } from '../transport/protocol';
import Transport from '../transport/abstract';
import { Http, Socket } from '../transport';
import DCService from './dc';
import { Message, PlainMessage } from '../message';
import {
  createAuthKey, bindTempAuthKey, initConnection, transferAuthorization,
} from './auth';
import RPCService from './rpc';
import { RPCHeaders, ClientError } from './rpc.types';
import UpdatesService from './updates';
import async from '../crypto/async';

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

  deviceModel: string,
  systemVersion: string,
  appVersion: string,
  langCode: string,
};

/** Default client configuration */
const defaultClientConfig = {
  test: false,
  ssl: true,
  dc: 2,
  protocol: 'intermediate' as MTProtoTransport,
  transport: 'websocket' as Transports,

  APILayer: 105,
  deviceModel: 'Unknown',
  systemVersion: 'Unknown',
  appVersion: '1.0.0',
  langCode: 'en',
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

  /** Updates service */
  updates: UpdatesService;

  /** Connection handlers */
  instances: Transport[];

  /** Quene of response callbacks for plain requests */
  plainResolvers: Record<string, RequestCallback> = {};

  /** Pending requests */
  pending: Record<number, Message[]>;

  /** DC state. 0 - attached, 1 - authorizing, 2 - ready */
  state: Record<number, number>;

  /** Creates new client handler */
  constructor(tl: TypeLanguage, cfg: Record<string, any> = {}) {
    this.tl = tl;
    this.cfg = { ...defaultClientConfig, ...cfg };

    this.svc = new DCService();
    this.rpc = new RPCService(this);
    this.updates = new UpdatesService(this);

    this.pending = {};
    this.state = {};

    this.instances = [
      this.createInstance(this.cfg.transport, cfg.dc, 1),
    ];

    this.authorize(cfg.dc);
  }

  // eslint-disable-next-line class-methods-use-this
  getPasswordKdfAsync(conf: any, password: string, cb: (result: object) => void): void {
    const payload = {
      salt1: conf.current_algo.salt1,
      salt2: conf.current_algo.salt2,
      g: conf.current_algo.g,
      p: conf.current_algo.p.toString(),
      srpB: conf.srp_B,
      srpId: conf.srp_id.toString(),
      password,
    };

    async('password_kdf', payload, (res: any) => cb({ ...res, srp_id: BigInt(res.srp_id) }));
  }

  /** Performs DH-exchange for temp and perm auth keys, binds them and invoking layer */
  authorize(dc: number, cb?: () => void): void {
    // Change state to block user requests
    if (!this.state[dc] || this.state[dc] !== 1) this.state[dc] = 1;

    const expiresAfter = 3600 * 5;
    const permKey = this.svc.getPermKey(dc);
    const tempKey = this.svc.getAuthKey(dc);

    if (permKey === null) {
      this.svc.setMeta(dc, 'tempKey', null);

      let calls = 0;
      const onKeyCreated = () => {
        calls += 1;
        if (calls === 2) this.authorize(dc, cb);
      };

      createAuthKey(this, dc, 1, 0, onKeyCreated);
      createAuthKey(this, dc, 2, expiresAfter, onKeyCreated);
      return;
    }

    if (tempKey === null || (tempKey.expires && tempKey.expires < Date.now() / 1000)) {
      createAuthKey(this, dc, 2, expiresAfter, () => this.authorize(dc, cb));
      return;
    }

    if (permKey && tempKey.binded === false) {
      bindTempAuthKey(this, dc, permKey, tempKey, () => this.authorize(dc, cb));
      return;
    }

    if (this.svc.getConnectionStatus(dc) === false) {
      initConnection(this, dc, () => this.authorize(dc, cb));
      return;
    }

    // if (this.svc.getUserID(dc) === null) {
    //   for (let i = 1; i <= 5; i += 1) {
    //     if (this.svc.getUserID(i) !== null && dc !== i) {
    //       const uid = this.svc.getUserID(i);
    //       transferAuthorization(this, uid as number, i, dc, () => this.authorize(dc, cb));
    //       return;
    //     }
    //   }
    // }

    if (dc !== this.cfg.dc && this.svc.getUserID(this.cfg.dc) !== null && this.svc.getUserID(dc) === null) {
      transferAuthorization(this, this.svc.getUserID(this.cfg.dc) as number, this.cfg.dc, dc, () => this.authorize(dc, cb));
      return;
    }

    // Unlock dc state to perform user requests
    this.state[dc] = 2;
    this.resendPending(dc);
    if (cb) cb();
  }

  /** Create new connection instance */
  createInstance(transport: string, dc: number, thread: number): Transport {
    if (transport === 'websocket') {
      return new Socket(this.svc, {
        ...this.cfg, dc, thread, resolve: this.resolve, resolveError: this.resolveError,
      });
    }

    return new Http(this.svc, {
      ...this.cfg, dc, thread, resolve: this.resolve, resolveError: this.resolveError,
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

    if (this.state[dc] !== 1 && this.state[dc] !== 2) {
      this.authorize(dc);
    }

    return newi;
  }

  /** Resolve response message */
  resolve = (msg: Message | PlainMessage, headers: RPCHeaders) => {
    const result = this.tl.parse(msg.data);

    if (msg instanceof PlainMessage) {
      if (msg.nonce && this.plainResolvers[msg.nonce]) {
        this.plainResolvers[msg.nonce](null, result);
        delete this.plainResolvers[msg.nonce];
      }
      return;
    }

    this.rpc.processMessage(result, headers);
  };

  /** Resolve transport error */
  resolveError = (dc: number, thread: number, transport: string, nonce: string, code?: number, message?: string) => {
    if (nonce && this.plainResolvers[nonce]) {
      this.plainResolvers[nonce]({ type: 'network', code: code || 0 });
      delete this.plainResolvers[nonce];
    }

    this.rpc.emitError(dc, thread, transport, code, message);
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
  public call(src: TLConstructor | Message, cb?: RequestCallback): void;
  public call(src: TLConstructor | Message, headers: Record<string, any>, cb?: RequestCallback): void;
  public call(method: string, data: Record<string, any>, cb?: RequestCallback): void;
  public call(method: string, data: Record<string, any>, headers: Record<string, any>, cb?: RequestCallback): void;
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

      if (src === 'msgs_ack' || src === 'http_wait') isc = false;

      if (typeof args[1] === 'object') headers = args[1] as Record<string, any>;
      if (typeof args[1] === 'function') cb = args[1] as RequestCallback;
      if (typeof args[2] === 'function') cb = args[2] as RequestCallback;
    } else throw new Error(`Unable to create request with ${src}`);

    if (headers.msgID) {
      msg.id = headers.msgID;
    } else {
      // refetch callback
      if (msg.id && this.rpc.messages[msg.id]) {
        if (this.rpc.messages[msg.id].cb) cb = this.rpc.messages[msg.id].cb;
        delete this.rpc.messages[msg.id];
      }

      msg.id = PlainMessage.GenerateID();
    }

    const dc = headers.dc || this.cfg.dc;
    const thread = headers.thread || 1;
    const transport = headers.transport || this.cfg.transport;

    msg.salt = this.svc.getSalt(dc);
    msg.sessionID = this.svc.getSessionID(dc);

    if (cb) {
      this.rpc.subscribe(msg, {
        dc, thread, transport, msgID: msg.id,
      }, cb);
    }

    const inst = this.getInstance(transport, dc, thread);

    if (this.state[dc] === 2 || headers.force === true) {
      msg.seqNo = this.svc.nextSeqNo(dc, isc);
      inst.send(msg);
    } else {
      this.addPendingMsg(transport, dc, thread, msg);
    }
  }

  /** Adds message to pending quence */
  addPendingMsg(transport: string, dc: number, thread: number, msg: Message) {
    const key = thread * 10 + dc + (transport === 'websocket' ? 1000 : 0);
    if (!this.pending[key]) this.pending[key] = [];
    this.pending[key].push(msg);
  }

  /** Resends messages from pending quence */
  resendPending(dc: number) {
    const keys = Object.keys(this.pending);

    for (let i = 0; i < keys.length; i += 1) {
      const key = +keys[i];
      if (key % 10 === dc) {
        const thread = key >= 1000 ? Math.floor((key - 1000) / 10) : Math.floor(key / 10);
        const transport = key >= 1000 ? 'websocket' : 'http';
        for (let j = 0; j < this.pending[key].length; j += 1) {
          console.log('resend', this.pending[key][j]);
          this.call(this.pending[key][j], { dc, thread, transport });
        }
        this.pending[key] = [];
      }
    }
  }
}
