/* eslint-disable no-dupe-class-members, lines-between-class-members, class-methods-use-this */
import { AuthKey } from '../services/auth';
import { Bytes } from '../serialization';

type DCConfig = {
  host: string,
  media: boolean,
};

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

  /** Datacenter meta data */
  meta: Record<number, {
    permKey?: AuthKey,
    tempKey?: AuthKey,
    salt?: string,
    sessionID?: string,
    sessionInited?: boolean,
    sessionExpire?: number,
    seqNo?: number,
    [key: string]: any,
  }> = {};

  /** Resolve hostname by dc id */
  getHost(dc: number) {
    return `${DCService.Config[dc].host}${DCService.Config[dc].host ? '-1' : ''}.web.telegram.org`;
  }

  setMeta(dc: number, param: 'salt' | 'sessionID', value: string): void;
  setMeta(dc: number, param: 'tempKey' | 'permKey', value: AuthKey): void;
  setMeta(dc: number, param: string, value: any) {
    if (!this.meta[dc]) this.meta[dc] = {};

    this.meta[dc][param] = value;
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

  getAuthKey(dc: number): AuthKey | null {
    if (!this.meta[dc]) return null;
    if (!this.meta[dc].tempKey) return null;

    return this.meta[dc].tempKey as AuthKey;
  }

  nextSeqNo(dc: number, isContentRelated: boolean = false): number {
    if (!this.meta[dc]) this.meta[dc] = {};
    if (!this.meta[dc].seqNo) this.meta[dc].seqNo = 1;

    const isc = isContentRelated ? 1 : 0;
    const seqNo = this.meta[dc].seqNo!;
    this.meta[dc].seqNo! += isc;

    return seqNo * 2 + isc;
  }
}
