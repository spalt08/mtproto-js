import TypeLanguage, { MethodDeclMap, build, parse } from '../tl';
import Transport, { TransportConfig, TransportState } from '../transport/abstract';
import { Http, Socket } from '../transport';
import DCService from './dc';
import { Message, PlainMessage, EncryptedMessage, ErrorMessage } from '../message';
import RPCService from './rpc';
import UpdatesService from './updates';
import { genPasswordSRP } from '../crypto/srp';
import { ClientError, ClientConfig, RequestCallback, defaultClientConfig, AuthKey, Transports, CallHeaders, PlainCallback } from './types';
import { MTProtoTransport } from '../transport/protocol';
import { logs } from '../utils/log';
import { raw2hex } from '../serialization';
import { createAuthKey, bindTempAuthKey, initConnection, transferAuthorization } from './auth';

type ClientEventListener = (...payload: any[]) => any;

const debug = (flag: boolean, ...rest: any[]) => {
  if (flag) logs('client')(...rest);
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
  dc: DCService;

  /** RPC service */
  rpc: RPCService;

  /** Updates service */
  updates: UpdatesService;

  /** Connection handlers */
  instances: Transport[];

  /** Quene of response callbacks for plain requests */
  plainRequests: Record<string, {
    dc: number,
    thread: number,
    transport: Transports,
    message: PlainMessage,
    cb: RequestCallback
  }> = {};

  /** DC auth state. 0 - attached, 1 - authorizing, 2 - ready */
  authState: Record<number, number>;

  /** Auth retries */
  authRetries: Record<number, number>;

  /** Client common events */
  listeners: Record<string, ClientEventListener[]> = {};

  pending: Record<number, Message[]> = {};

  /** Creates new client handler */
  constructor(tl: TypeLanguage, cfg: Record<string, any> = {}) {
    this.tl = tl;

    this.cfg = { ...defaultClientConfig, ...cfg };

    this.dc = new DCService(cfg.meta, (meta) => {
      this.emit('metaChanged', meta);
    });

    this.rpc = new RPCService(this);
    this.updates = new UpdatesService(this);

    this.authState = {};
    this.authRetries = {};
    this.pending = {};

    this.instances = [
      this.createInstance(this.cfg.transport, cfg.dc, 1),
    ];

    if (this.cfg.autoConnect) this.authorize(cfg.dc);
  }

  getPasswordKdfAsync(conf: any, password: string, cb: (result: object) => void): void {
    const srp = genPasswordSRP(
      raw2hex(conf.current_algo.salt1),
      raw2hex(conf.current_algo.salt2),
      conf.current_algo.g,
      raw2hex(conf.current_algo.p),
      conf.srp_id,
      raw2hex(conf.srp_B),
      password,
    );

    cb(srp);
  }

  /** Performs DH-exchange for temp and perm auth keys, binds them and invoking layer */
  authorize(dc: number, cb?: (key: AuthKey) => void): void {
    // Change state to block user requests
    if (!this.authState[dc] || this.authState[dc] !== 1) this.authState[dc] = 1;
    if (!this.authRetries[dc]) this.authRetries[dc] = 0;


    // this.authRetries[dc] += 1;

    // if (this.authRetries[dc] > 6) {
    //   this.authState[dc] = 0;
    //   this.authRetries[dc] = 0;
    //   return;
    // }

    const expiresAfter = 3600 * 5;
    const permKey = this.dc.getPermKey(dc);
    const tempKey = this.dc.getAuthKey(dc);

    if (permKey === null) {
      this.dc.setMeta(dc, 'tempKey', null);

      let calls = 0;

      const onKeyCreated = () => {
        calls += 1;
        if (calls === 2) this.authorize(dc, cb);
      };

      createAuthKey(this, dc, 2, 0, onKeyCreated);
      createAuthKey(this, dc, 1, expiresAfter, onKeyCreated);
      return;
    }

    if (tempKey === null || (tempKey.expires && tempKey.expires < Date.now() / 1000)) {
      createAuthKey(this, dc, 1, expiresAfter, () => this.authorize(dc, cb));
      return;
    }

    if (permKey && tempKey.binded === false) {
      bindTempAuthKey(this, dc, permKey, tempKey, () => this.authorize(dc, cb));
      return;
    }

    if (this.dc.getConnectionStatus(dc) === false) {
      initConnection(this, dc, () => {
        this.authorize(dc, cb);
      });
      return;
    }

    const uid = this.dc.getUserID(this.cfg.dc);

    // transfer auth if exists
    if (dc !== this.cfg.dc && uid !== null && uid > 0 && this.dc.getUserID(dc) !== uid) {
      transferAuthorization(this, uid, this.cfg.dc, dc, () => this.authorize(dc, cb));
      return;
    }

    // Unlock dc state to perform user requests
    this.authState[dc] = 2;
    this.authRetries[dc] = 0;
    this.resendPending(dc);

    if (cb) cb(null);
  }

  /** Create new connection instance */
  createInstance(transport: string, dc: number, thread: number): Transport {
    const instanceConfig = {
      test: this.cfg.test,
      debug: this.cfg.debug,
      ssl: this.cfg.ssl,
      dc,
      host: this.dc.getHost(dc),
      thread,
      protocol: 'intermediate' as MTProtoTransport,
    };

    if (transport === 'websocket') {
      return new Socket(this.resolve, { ...instanceConfig, transport: 'websocket' });
    }

    return new Http(this.resolve, { ...instanceConfig, transport: 'http' });
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

    if (this.authState[dc] !== 1 && this.authState[dc] !== 2) {
      this.authorize(dc);
    }

    return newi;
  }

  /** Resolve response message */
  resolve = (cfg: TransportConfig, msg: TransportState | ErrorMessage | EncryptedMessage | PlainMessage) => {
    // resolve tranport state event
    if (typeof msg === 'string') {
      // emit client event if base dc status sent
      if (cfg.dc === this.cfg.dc && cfg.thread === 1) {
        this.emit('networkChanged', msg);
      }

      // resend plain requests
      if (msg === 'disconnected') {
        const nonces = Object.keys(this.plainRequests);

        for (let i = 0; i < nonces.length; i += 1) {
          const nonce = nonces[i];
          if (this.plainRequests[nonce].dc === cfg.dc
            && this.plainRequests[nonce].thread === cfg.thread
            && this.plainRequests[nonce].transport === cfg.transport) {
            this.getInstance(cfg.transport, cfg.dc, cfg.thread).send(this.plainRequests[nonce].message);
          }
        }

        const ids = Object.keys(this.rpc.requests);

        // resend rpc requests
        for (let i = 0; i < ids.length; i += 1) {
          const id = ids[i];
          if (this.rpc.requests[id].dc === cfg.dc
            && this.rpc.requests[id].thread === cfg.thread
            && this.rpc.requests[id].transport === cfg.transport) {
            // message should wait for dh exchange if auth is processing
            if (this.authState[cfg.dc] === 2) {
              const message = this.encrypt(this.rpc.requests[id].message, this.rpc.requests[id].dc);
              this.getInstance(cfg.transport, cfg.dc, cfg.thread).send(message);
            } else {
              this.pending[cfg.dc].push(this.rpc.requests[id].message);
            }
          }
        }
      }

      return;
    }

    // resolve messages
    let message: ErrorMessage | EncryptedMessage | Message | PlainMessage = msg;

    if (msg instanceof ErrorMessage) {
      if (msg.error.code === -1 && this.authState[cfg.dc] !== 1) {
        console.warn('switching auth key for dc', cfg.dc); // eslint-disable-line no-console
        this.dc.setMeta(cfg.dc, 'tempKey', null);
      }
    }

    if (msg instanceof EncryptedMessage) {
      const authKey = this.dc.keys[cfg.dc];
      if (!authKey) throw new Error(`Unable to decrypt message without auth key (dc: ${cfg.dc}`);
      message = msg.decrypt(authKey.key);
    }

    let error: ClientError = null;
    if (msg instanceof ErrorMessage) {
      error = {
        type: 'transport',
        ...msg.error,
      };
    }

    let result: any;
    let id = '';

    if (message instanceof PlainMessage || message instanceof Message) {
      result = parse(message.reader);
      id = message.id;
    }

    if (message instanceof PlainMessage) {
      const nonce = JSON.stringify(message.nonce);
      const request = this.plainRequests[nonce];
      delete this.plainRequests[nonce];

      if (!request.cb) throw new Error(`Expected plain request callback for nonce ${nonce}`);

      request.cb(error, result);

      return;
    }

    if (!error && result) {
      this.rpc.processMessage(result, {
        id,
        dc: cfg.dc,
        thread: cfg.thread,
        transport: cfg.transport,
      });
    } else {
      this.rpc.emit(id, error);
    }
  };

  /** Create plain message and send it to the server */
  public plainCall<K extends keyof MethodDeclMap>(method: K, data: MethodDeclMap[K]['req'], cb?: PlainCallback<K>): void;
  public plainCall<K extends keyof MethodDeclMap>(method: K, data: MethodDeclMap[K]['req'], headers: CallHeaders, cb?: PlainCallback<K>): void;
  public plainCall<K extends keyof MethodDeclMap>(method: K, data: MethodDeclMap[K]['req'], ...args: unknown[]): void {
    let cb: PlainCallback<K> | undefined;
    let headers: CallHeaders = {};

    const payload = data as any;
    payload._ = method;
    const msg = new PlainMessage(build(payload), true);

    if (typeof args[0] === 'object') headers = args[0] as CallHeaders;
    if (typeof args[0] === 'function') cb = args[0] as PlainCallback<K>;
    if (typeof args[1] === 'function') cb = args[1] as PlainCallback<K>;

    if (headers.msgID) msg.id = headers.msgID;
    if (msg.id === '0000000000000000') msg.id = PlainMessage.GenerateID();

    const dc = headers.dc || this.cfg.dc;
    const thread = headers.thread || 1;
    const transport = headers.transport || this.cfg.transport;

    // Resolve plain message
    if (cb) {
      this.plainRequests[JSON.stringify(msg.nonce)] = {
        dc,
        thread,
        transport,
        message: msg,
        cb,
      };
    }

    this.getInstance(transport, dc, thread).send(msg);
  }

  /** Encrypt message */
  encrypt(msg: Message, dc: number): EncryptedMessage {
    const authKey = this.dc.keys[dc];
    if (!authKey) throw new Error(`Unable to encrypt message without auth key (dc: ${dc}`);

    const encrypted = msg.encrypt(authKey.key, authKey.id);

    encrypted.isContentRelated = msg.isContentRelated;

    return encrypted;
  }

  /** Create message, encrypt it and send it to the server */
  public call<K extends keyof MethodDeclMap>(method: K, data: MethodDeclMap[K]['req'], cb?: PlainCallback<K>): void;
  public call<K extends keyof MethodDeclMap>(method: K, data: MethodDeclMap[K]['req'], headers: CallHeaders, cb?: PlainCallback<K>): void;
  public call<K extends keyof MethodDeclMap>(method: K, data: MethodDeclMap[K]['req'], ...args: unknown[]): void {
    let cb: PlainCallback<K> | undefined;
    let headers: CallHeaders = {};

    const payload = data as any;
    payload._ = method;
    const msg = new Message(build(payload), true);

    if (typeof args[0] === 'object') headers = args[0] as CallHeaders;
    if (typeof args[0] === 'function') cb = args[0] as PlainCallback<K>;
    if (typeof args[1] === 'function') cb = args[1] as PlainCallback<K>;

    headers.method = method;
    this.send(msg, headers, cb);
  }

  public send(msg: Message, headers: CallHeaders, cb?: PlainCallback<any>) {
    if (headers.msgID) {
      msg.id = headers.msgID;
    } else {
      // refetch callback
      if (msg.id !== '0000000000000000' && this.rpc.requests[msg.id]) {
        cb = this.rpc.requests[msg.id].cb;
        delete this.rpc.requests[msg.id];
      }

      msg.id = PlainMessage.GenerateID();
    }

    const dc = headers.dc || this.cfg.dc;
    const thread = headers.thread || 1;
    const transport = headers.transport || this.cfg.transport;
    const isc = (headers.method !== 'msgs_ack' && headers.method !== 'http_wait');

    msg.salt = this.dc.getSalt(dc);
    msg.sessionID = this.dc.getSessionID(dc);

    if (isc) this.rpc.subscribe(msg, dc, thread, transport, cb);

    const instance = this.getInstance(transport, dc, thread);

    if (this.authState[dc] === 2 || headers.force === true) {
      if (msg instanceof PlainMessage) {
        instance.send(msg);
      } else {
        msg.isContentRelated = isc;
        msg.seqNo = this.dc.nextSeqNo(dc, isc);

        instance.send(this.encrypt(msg, dc));
      }

      debug(this.cfg.debug && headers.method !== 'msgs_ack', Date.now(), msg.id, 'seq:', msg.seqNo, 'call', headers.method);
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
          this.send(this.pending[key][j], { dc, thread, transport });
        }
        this.pending[key] = [];
      }
    }
  }

  /** Subscription for client event */
  on(eventName: 'networkChanged', cb: (state: TransportState) => void): void;
  on(eventName: 'metaChanged', cb: (meta: Record<number, any>) => void): void;
  on(eventName: string, cb: ClientEventListener): void {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];
    this.listeners[eventName].push(cb);
  }

  /** Emit client event */
  emit(eventName: 'networkChanged', state: TransportState): void;
  emit(eventName: 'metaChanged', meta: Record<number, any>): void;
  emit(eventName: string, ...args: unknown[]) {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];
    for (let i = 0; i < this.listeners[eventName].length; i += 1) {
      this.listeners[eventName][i](...args);
    }
  }
}
