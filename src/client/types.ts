import { MTProtoTransport } from '../transport/protocol';
import TypeLanguage, { TLConstructor } from '../tl';
import { Message, PlainMessage } from '../message';

/** Authorization key info with PFS */
export type AuthKey = null | {
  key: string,
  id: string,
  expires?: number,
  binded?: boolean,
};

export type Transports = 'http' | 'websocket';

/** Client configuration type */
export type ClientConfig = {
  test: boolean,
  debug: boolean,
  ssl: boolean,
  dc: number,
  protocol: MTProtoTransport,
  transport: Transports,
  meta: Record<number, any>,

  APILayer: number,
  APIID?: string,
  APIHash?: string,

  deviceModel: string,
  systemVersion: string,
  appVersion: string,
  langCode: string,

  autoConnect: boolean,
};

/** Default client configuration */
export const defaultClientConfig: ClientConfig = {
  test: false,
  debug: false,
  ssl: true,
  dc: 2,
  protocol: 'intermediate' as MTProtoTransport,
  transport: 'websocket' as Transports,
  meta: {},

  APILayer: 105,
  deviceModel: 'Unknown',
  systemVersion: 'Unknown',
  appVersion: '1.0.0',
  langCode: 'en',

  autoConnect: true,
};

export type RequestRPC = {
  message: Message,
  dc: number,
  thread: number,
  transport: Transports,
  cb?: RequestCallback,
};

/** Generic error for mtproto client */
export type ClientError = {
  type: 'rpc' | 'network' | 'transport' | 'internal';
  code: number,
  message?: string,
} | null;

/** Request callback */
export type RequestCallback = (error: ClientError | null, result?: undefined | any) => void;

/** DCService interface to avoid dependency cycle */
export interface DCServiceInterface {
  setMeta(dc: number, param: 'userID', value: number): void;
  setMeta(dc: number, param: 'seqNo', value: number): void;
  setMeta(dc: number, param: 'salt' | 'sessionID', value: string): void;
  setMeta(dc: number, param: 'tempKey' | 'permKey', value: AuthKey): void;
  setMeta(dc: number, param: 'connectionInited', value: boolean): void;
  getSalt(dc: number): string;
  nextSeqNo(dc: number, isContentRelated: boolean): number;
}

export interface UpdateServiceInterface {
  process(updateMsg: TLConstructor): void;
}

/** Client interface to avoid dependency cycle */
export interface ClientInterface {
  cfg: ClientConfig;
  tl: TypeLanguage;
  dc: DCServiceInterface;
  updates: UpdateServiceInterface;
  plainCall(src: TLConstructor | PlainMessage, cb: RequestCallback): void;
  plainCall(src: TLConstructor | PlainMessage, headers: Record<string, any>, cb: RequestCallback): void;
  plainCall(method: string, data: Record<string, any>, cb: RequestCallback): void;
  plainCall(method: string, data: Record<string, any>, headers: Record<string, any>, cb: RequestCallback): void;
  call(src: TLConstructor | Message, cb?: RequestCallback): void;
  call(src: TLConstructor | Message, headers: Record<string, any>, cb?: RequestCallback): void;
  call(method: string, data: Record<string, any>, cb?: RequestCallback): void;
  call(method: string, data: Record<string, any>, headers: Record<string, any>, cb?: RequestCallback): void;
}

/** Datacenter info */
export type DatacenterMeta = {
  permKey?: AuthKey,
  tempKey?: AuthKey,
  salt?: string,
  sessionID?: string,
  sessionExpire?: number,
  connectionInited?: boolean,
  seqNo?: number,
  userID?: number,
  [key: string]: any,
};

/** Client Datacenter Meta info */
export type ClientMeta = Record<number, DatacenterMeta>;

/** Headers for recursive processing rpc messages */
export type RPCHeaders = {
  id: string,
  dc: number,
  thread: number,
  transport: string,
};
