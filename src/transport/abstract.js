// @flow

import type {
  DataStorage, Transport, Message, TLAny, RPCResult,
} from '../interfaces';

import TypeLanguage from '../tl';
import { ParseKey } from '../crypto/rsa/keys';
import { AuthService, SessionService, RPCService } from '../services';
import DefaultStorage from '../storage';

/** Generic config for mtproto transport classes */
export type GenericTranportConfig = {
  APIID?: string,
  APIHash?: string,
  APILayer: number,
  RSAKeys?: string[],
  storage: DataStorage,
};

/** Default generic config */
const defaultConfig = {
  APILayer: 105,
  storage: new DefaultStorage(),
};

/** Abstract class for all mtproto transport classes
 * @param {TypeLanguage} tl Type Language handler
 * @param {object} services Attached services
 * @param {number} APILayer API Layer
*/
export default class AbstractTransport implements Transport {
  /** Type Language handler */
  tl: TypeLanguage;

  /** Attached services */
  services: {
    auth: AuthService;
    session: SessionService;
    rpc: RPCService;
  };

  /** API Layer */
  APILayer: number

  /**
   * Creates abstract transport object
   * @param {GenericTranportConfig} cfg Generic transport config
   */
  constructor(tl: TypeLanguage, extCfg?: GenericTranportConfig) {
    this.tl = tl;

    const cfg: GenericTranportConfig = { ...defaultConfig, ...extCfg };
    const { storage, APILayer } = cfg;

    this.APILayer = APILayer;

    this.services = {
      auth: new AuthService(this, tl, storage),
      session: new SessionService(this, tl, storage),
      rpc: new RPCService(this, tl),
    };

    if (cfg.RSAKeys) {
      for (let i = 0; i <= cfg.RSAKeys.length; i += 1) this.services.auth.RSAKeys.push(ParseKey(cfg.RSAKeys[i]));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  call(query: TLAny | Message | string): Promise<RPCResult> {
    throw new Error(`Abstract Transport does not implements call method, query: ${query.toString()}`);
  }

  // eslint-disable-next-line class-methods-use-this
  callPlain(query: TLAny | Message | string): Promise<RPCResult> {
    throw new Error(`Abstract Transport does not implements callPlain method, query: ${query.toString()}`);
  }
}
