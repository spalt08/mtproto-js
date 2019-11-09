/* eslint-disable class-methods-use-this, @typescript-eslint/no-unused-vars, no-dupe-class-members */
import TypeLanguage, { TLConstructor, TLAbstract } from '../tl';
import { Message, PlainMessage, EncryptedMessage } from '../message';
import { DCService, AuthService } from '../services';

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
  APILayer: number,
  baseDC?: number,
};

/** Default generic config */
const defaultConfig = {
  APILayer: 105,
};

/**
 * Abstract class for all mtproto transport classes
 */
export default class Transport {
  /** Type Language handler */
  tl: TypeLanguage;

  /** API Layer */
  APILayer: number;

  /** Datacenter service */
  dc: DCService;

  /** Authorization service */
  auth: AuthService;

  /**
   * Creates abstract transport object
   * @param {GenericTranportConfig} cfg Generic transport config
   */
  constructor(tl: TypeLanguage, extCfg?: GenericTranportConfig) {
    this.tl = tl;

    const cfg: GenericTranportConfig = { ...defaultConfig, ...extCfg };

    this.APILayer = cfg.APILayer;

    this.dc = new DCService(cfg.baseDC);
    this.auth = new AuthService(this, this.tl);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  call(_query: TLConstructor | Message | string, _args: Record<string, any>, _aargs: Record<string, any>) {}

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

    return this.send(msg, cb);
  }

  send(_msg: PlainMessage | EncryptedMessage, _cb: ResponseCallback) {
    throw new Error('You should overload send method first');
  }
}
