// @flow

import type { DataStorage, Transport } from '../interfaces';
import type TypeLanguage from '../typeLanguage';

import { ParseKey } from '../crypto/rsa/keys';
import AuthService from '../services/auth';
import SessionService from '../services/session';
import RPCService from '../services/rpc';
import DefaultStorage from '../storage';

/**
 * Generic config for mtproto transport classes
 */
export type GenericTranportConfig = {
  APIID?: string,
  APIHash?: string,
  APILayer?: number,
  RSAKeys?: string[],
  storage?: DataStorage,
};

/** Abstract class for all mtproto transport classes
 * @param {TypeLanguage} tl Type Language handler
 * @param {DataStorage} storage Storage handler
 * @param {object} services Attached services
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

  /**
   * Creates abstract transport object
   * @param {GenericTranportConfig} cfg Generic transport config
   */
  constructor(tl: TypeLanguage, cfg?: GenericTranportConfig = {}) {
    this.tl = tl;

    const storage = cfg.storage || new DefaultStorage();

    this.services = {
      auth: new AuthService(this, tl, storage),
      session: new SessionService(this, tl),
      rpc: new RPCService(this, tl),
    };

    if (cfg.RSAKeys) {
      for (let i = 0; i <= cfg.RSAKeys.length; i += 1) this.services.auth.RSAKeys.push(ParseKey(cfg.RSAKeys[i]));
    }

    if (!this.services.auth.tempKey.id || !this.services.auth.permKey.id) this.services.auth.createAuthKeys();
  }

  // eslint-disable-next-line class-methods-use-this
  call() {
    throw new Error('Abstract Transport does not implements call method');
  }

  // eslint-disable-next-line class-methods-use-this
  callPlain() {
    throw new Error('Abstract Transport does not implements callPlain method');
  }
}
