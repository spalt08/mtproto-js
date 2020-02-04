import { Bytes } from '../serialization';
import { ClientMeta, AuthKey } from './types';

type DCConfig = {
  host: string,
  media: boolean,
};

type MetaUpdateCallback = (data: ClientMeta) => void;

/**
 * Helper class for managing datacenters
 */
export default class DCService {
  static Config: Record<number, DCConfig> = {
    1: { host: 'pluto', media: true },
    2: { host: 'venus', media: true },
    3: { host: 'aurora', media: true },
    4: { host: 'vesta', media: true },
    5: { host: 'flora', media: true },
  };

  /** On change callback */
  callback?: MetaUpdateCallback;

  /** Datacenter meta data */
  meta: ClientMeta = {};

  constructor(initial: ClientMeta, callback?: MetaUpdateCallback) {
    this.meta = initial;
    this.callback = callback;
  }

  /** Resolve hostname by dc id */
  getHost(dc: number) {
    return `${DCService.Config[dc].host}${DCService.Config[dc].media ? '-1' : ''}.web.telegram.org`;
  }

  setMeta(dc: number, param: 'userID', value: number): void;
  setMeta(dc: number, param: 'seqNo', value: number): void;
  setMeta(dc: number, param: 'salt' | 'sessionID', value: string): void;
  setMeta(dc: number, param: 'tempKey' | 'permKey', value: AuthKey): void;
  setMeta(dc: number, param: 'connectionInited', value: boolean): void;
  setMeta(dc: number, param: string, value: any) {
    if (!this.meta[dc]) this.meta[dc] = {};

    this.meta[dc][param] = value;

    if (this.callback) this.callback(this.meta);
  }

  getSessionID(dc: number): string {
    if (!this.meta[dc]) this.meta[dc] = {};
    if (!this.meta[dc].sessionID) this.meta[dc].sessionID = new Bytes(8).randomize().hex;

    return this.meta[dc].sessionID as string;
  }

  getSalt(dc: number): string {
    if (!this.meta[dc]) this.meta[dc] = {};
    if (!this.meta[dc].salt) this.meta[dc].salt = new Bytes(8).randomize().hex;

    return this.meta[dc].salt as string;
  }

  getAuthKey(dc: number): AuthKey {
    if (!this.meta[dc]) return null;
    if (!this.meta[dc].tempKey) return null;

    return this.meta[dc].tempKey as AuthKey;
  }

  getPermKey(dc: number): AuthKey {
    if (!this.meta[dc]) return null;
    if (!this.meta[dc].permKey) return null;

    return this.meta[dc].permKey as AuthKey;
  }

  getUserID(dc: number): number | null {
    if (!this.meta[dc]) return null;
    if (!this.meta[dc].userID) return null;

    return this.meta[dc].userID as number;
  }

  getConnectionStatus(dc: number): boolean {
    if (!this.meta[dc]) return false;
    if (!this.meta[dc].connectionInited) return false;

    return this.meta[dc].connectionInited as boolean;
  }

  /**
   * Increment msg_seq_no if message is content related
   * Ref: https://core.telegram.org/mtproto/description#message-sequence-number-msg-seqno
   */
  nextSeqNo(dc: number, isContentRelated: boolean = false): number {
    if (!this.meta[dc]) this.meta[dc] = {};
    if (!this.meta[dc].seqNo) this.meta[dc].seqNo = 1;

    const isc = isContentRelated ? 1 : 0;
    const seqNo = this.meta[dc].seqNo!;

    if (isc > 0) this.setMeta(dc, 'seqNo', this.meta[dc].seqNo! + isc);

    return seqNo * 2 + isc;
  }
}
