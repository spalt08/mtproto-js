// @flow

import TypeLanguage from '../typeLanguage';
import AuthService from '../services/auth';
import SessionService from '../services/session';
import RPCService from '../services/rpc';
import { ParseKey } from '../crypto/rsa/keys';
import type { Transport } from '../interfaces';

export default class AbstractTransport implements Transport {
  /** Type Language handler */
  tl: TypeLanguage;

  /** Attached services */
  services: {
    auth: AuthService;
  };

  confCb: (key: string, value: any) => any;

  /**
   * Creates new AbstractTransport object with attached services
   * @param {TypeLanguage} tl Type Language handler
   * @param {TransportConfig} cfg Transport Configuration
   * @constructs
   */
  constructor(tl: TypeLanguage, cfg?: TransportConfig = {}) {
    this.services = {
      auth: new AuthService(this, tl),
      rpc: new RPCService(this, tl),
      session: new SessionService(this, tl),
    };

    if (cfg.sessionID) this.setSession(cfg.sessionID, true);
    if (cfg.serverSalt) this.setServerSalt(cfg.serverSalt, true);
    if (cfg.authKeyPerm) this.setAuthKeys(cfg.authKeyPerm, cfg.authKeyTemp, true);
  }

  /**
   * Binds callback for server configuration change
   * @param {func} cb Callback
   */
  onConfigurationChange(cb: (key: string, value: any) => any) {
    this.confCb = cb;
  }

  /**
   * Calls callback for server configuration change
   */
  updateConfiguration(key: string, value: any) {
    this.confCb(key, value);
  }

  /**
   * Performs dh-exchange to create an authKey
   * Ref: https://core.telegram.org/mtproto/auth_key
   */
  async authorize() {
    const authKeys = await this.services.auth.createAuthKeys();
    this.setAuthKeys(authKeys.permanent, authKeys.temporary);
  }

  async initConnection() {
    await this.services.session.initConnection();
  }

  /**
   * Sets session data to session service
   * @param {string} id Session ID
   * @param {boolean} silent Flag for calling conf update callback
   */
  setSession(id: string, silent?: boolean = false) {
    this.services.session.setSession(id);
    if (silent === false) this.updateConfiguration('sessionID', id.toString());
  }

  /**
   * Sets server salt to session service
   * @param {string} salt Salt
   * @param {boolean} silent Flag for calling conf update callback
   */
  setServerSalt(salt: string, silent?: boolean = false) {
    this.services.session.setServerSalt(salt);
    if (silent === false) this.updateConfiguration('serverSalt', salt.toString());
  }

  /**
   * Gets server salt from session service
   * @returns {string} Salt
   */
  getServerSalt(): string {
    return this.services.session.getServerSalt();
  }

  /**
   * Sets temporary and permanent auth keys to auuth service
   * @param {string} perm Permenent Auth Key
   * @param {string} temp Temporary Auth Key
   * @param {boolean} silent Flag for calling conf update callback
   */
  setAuthKeys(perm: string, temp: string, silent?: boolean = false) {
    this.services.auth.setAuthKeyPerm(perm);
    this.services.auth.setAuthKeyTemp(temp);

    if (silent === false) {
      this.updateConfiguration('authKeyPerm', perm.toString());
      this.updateConfiguration('authKeyTemp', temp.toString());
    }
  }

  /**
   * Adds server rsa key
   * @param {string} b64key Base64 encoded key
   */
  addRSAKey(b64key: string) {
    this.services.auth.RSAKeys.push(ParseKey(b64key));
  }
}
