/* eslint-disable no-dupe-class-members, lines-between-class-members */
import { AuthKey } from './auth';
import { Bytes } from '../serialization';

/**
 * Helper class for managing datacenters
 */
export default class DCService {
  static Alias: Record<number, string> = {
    1: 'pluto',
    2: 'venus',
    3: 'aurora',
    4: 'vesta',
    5: 'flora',
  };

  /** Default datacenter */
  default: number = 2;

  /** Datacenter meta data */
  meta: Record<number, {
    tempKey?: AuthKey,
    salt?: string,
    sessionID?: string,
    sessionInited?: boolean,
    sessionExpire?: number,
    seqNo?: number,
    [key: string]: any,
  }> = {};

  constructor(base?: number) {
    if (base) this.default = base;
  }

  /** Resolve hostname by dc id */
  getHost(dc: number = this.default, isCDN: boolean = false) {
    return `${DCService.Alias[dc]}${isCDN ? '' : '-1'}.web.telegram.org`;
  }

  setMeta(dc: number, param: 'salt' | 'sessionID', value: string): void;
  setMeta(dc: number, param: 'tempKey', value: AuthKey): void;
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
