// @flow

import BigInt from 'big-integer';

import type { Transport, DataStorage } from '../interfaces';

import TypeLanguage from '../tl';
import { Hex, MessageData } from '../serialization';
import pqPrimePollard from '../crypto/pq';
import { PredefinedKeys } from '../crypto/rsa/keys';
import RSAEncrypt from '../crypto/rsa/encrypt';
import AESDecrypt from '../crypto/aes/decrypt';
import AESEncrypt from '../crypto/aes/encrypt';
import { encryptDataMessage } from '../crypto/aes/message_v1';
import SHA1 from '../crypto/sha1';
import getTime from '../utils/timer';
import { logs } from '../utils/log';

const log = logs('auth');

/** RSA Key */
type RSAKey = {
  fingerprint: string,
  n: string,
  e: string,
};

/**
 * Service class helper for authorization stuff
 * @param {object} tempKey Temporary authorization key
 * @param {object} permKey Temporary authorization key
 */
export default class AuthService {
  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /** Storage handler */
  storage: DataStorage;

  /**
   * Authorization keys
   * Ref: https://core.telegram.org/mtproto/auth_key
   */
  keys: {
    permanent: {
      key: Hex,
      id: Hex,
    },
    temporary: {
      key: Hex,
      id: Hex,
      expires: number,
      binded: boolean,
    },
  };

  /** RSA Keys */
  RSAKeys: Array<RSAKey>

  /**
   * Creates auth service object
   * @param {transport} transport Transport Handler
   * @param {TypeLanguage} tl Type Language Handler
   * @constructs
   */
  constructor(transport: Transport, tl: TypeLanguage, storage: DataStorage) {
    this.tl = tl;
    this.transport = transport;
    this.storage = storage;

    const tempKey = new Hex(this.storage.load('auth', 'authKeyTemp'));
    const permKey = new Hex(this.storage.load('auth', 'authKeyPerm'));
    const expireAt = this.storage.load('auth', 'tempKeyExpire');
    const isBinded = this.storage.load('auth', 'tempKeyBinded');

    this.keys = {
      temporary: {
        key: tempKey,
        id: tempKey ? SHA1.Hex(tempKey).sliceBytes(-8) : new Hex(),
        expires: expireAt || 0,
        binded: isBinded || false,
      },
      permanent: {
        key: permKey,
        id: tempKey ? SHA1.Hex(permKey).sliceBytes(-8) : new Hex(),
      },
    };

    this.RSAKeys = [...PredefinedKeys];
  }

  /**
   * Gets temporary authorization key object
   * @returns {{ key: Hex, id: Hex, expires: number, binded: boolean }} Temporary authorization key and it's ID, expire time and binding info
   */
  get tempKey(): { key: Hex, id: Hex, expires: number, binded: boolean } {
    return this.keys.temporary;
  }

  /**
   * Sets temporary authorization key
   * @param {string} key Temporary authorization key
   */
  set tempKey(key: string) {
    const hexKey = new Hex(key);

    this.storage.save('auth', 'authKeyTemp', hexKey.toString());

    this.keys.temporary = {
      key: hexKey,
      id: SHA1.Hex(hexKey).sliceBytes(-8),
      expires: 0,
      binded: false,
    };
  }

  /**
   * Sets temporary authorization key expire time
   * @param {number} expire Temporary authorization key expire time
   */
  set tempKeyExpire(expireAt: number) {
    this.storage.save('auth', 'tempKeyExpire', expireAt);
    this.keys.temporary.expires = expireAt;
  }

  /**
   * Sets temporary authorization key binding flag
   * @param {boolean} isBinded Binding flag
   */
  set tempKeyBinding(isBinded: boolean) {
    this.storage.save('auth', 'tempKeyBinded', isBinded);
    this.keys.temporary.binded = isBinded;
  }

  /**
   * Gets permanent authorization key object
   * @returns {{ key: Hex, id: Hex }} Permanent authorization key and it's ID
   */
  get permKey(): { key: Hex, id: Hex } {
    return this.keys.permanent;
  }

  /**
   * Sets permanent authorization key
   * @param {string} key Permanent authorization key
   */
  set permKey(key: string) {
    const hexKey = new Hex(key);

    this.storage.save('auth', 'authKeyPerm', hexKey.toString());

    this.keys.permanent = {
      key: hexKey,
      id: SHA1.Hex(hexKey).sliceBytes(-8),
    };
  }

  /**
   * Manages auth keys and performs authorization is necessary
   */
  async prepare() {
    // Permanent auth key wasn't loaded from storage
    if (this.keys.permanent.key.length === 0) {
      await this.createAuthKeys();

    // Temporary auth key wasn't loaded from storage or it is expired
    } else if (this.keys.temporary.expires < getTime().second || this.keys.temporary.key.length === 0) {
      await this.createAuthKey(true);
      await this.bindTempAuthKey();

    // Temporary auth key wasn't binded
    } else if (this.keys.temporary.binded === false) {
      await this.bindTempAuthKey();

    // All keys successfuly loadedd
    } else {
      log('auth keys loaded from storage');
    }
  }

  /**
   * Creates temporary and permanent auth keys and binds it togher
   * Ref: https://core.telegram.org/mtproto/auth_key
   * @returns {{ [string]: { key: Hex, id: Hex }} Permanent and temporary auth keys
   */
  async createAuthKeys() {
    const expiresIn = 3600 * 24 * 7;

    await Promise.all([
      this.createAuthKey(),
      this.createAuthKey(true, expiresIn),
    ]);

    await this.bindTempAuthKey();
  }

  /**
   * Creates AuthKey using DH-exchange
   * Ref: https://core.telegram.org/mtproto/auth_key
   * @param {boolean} isTemporary Flag for temporary key generation
   * @param {number} expiresAfter Time to expire temporary key in seconds
   * @returns {string} Temporary or permanent auth key
   */
  async createAuthKey(isTemporary?: boolean = false, expiresAfter?: number = 3600 * 24 * 7) {
    log(`creating ${isTemporary ? 'temporary' : 'permanent'} key async`);

    const nonce = Hex.random(16);
    const newNonce = Hex.random(32);

    const reqPQ = this.tl.query('req_pq_multi#be7e8ef1 nonce:int128 = ResPQ', { nonce });
    const [resPQ] = await this.transport.callPlain(reqPQ);

    if (resPQ.declaration.predicate !== 'resPQ') throw new Error(`Auth: Unexpected resPQ response. Got ${resPQ.declaration.predicate}`);

    const serverNonce = resPQ.params.server_nonce.getHex();

    const pq = resPQ.params.pq.getHex();
    const [p, q] = pqPrimePollard(pq);

    let publicKeyFingerprint: number;
    let publicKey: ?RSAKey;

    for (let i = 0; i < resPQ.params.server_public_key_fingerprints.items.length; i += 1) {
      const publicKeyFingerprintHex = resPQ.params.server_public_key_fingerprints.items[i].getHex().toString();
      publicKey = this.RSAKeys.find((k) => k.fingerprint === publicKeyFingerprintHex);

      if (publicKey) {
        publicKeyFingerprint = resPQ.params.server_public_key_fingerprints.items[i].getValue();
        break;
      }
    }

    if ((!publicKey) && publicKeyFingerprint) {
      throw new Error(`RSA: Unknown public key fingerprint ${publicKeyFingerprint}`);
    }

    const pqInner = this.tl.construct(isTemporary ? 'p_q_inner_data_temp' : 'p_q_inner_data', {
      pq,
      p: new Hex(p),
      q: new Hex(q),
      nonce,
      server_nonce: serverNonce,
      new_nonce: newNonce,
    });

    if (isTemporary) pqInner.params.expires_in.setValue(expiresAfter);

    const data = pqInner.serialize().toHex();
    const dataHash = SHA1.Hex(data);
    const dataWithHash = dataHash + data + Hex.random(255 - ((data.byteLength + dataHash.byteLength) % 255));

    const reqDH = this.tl.query('req_DH_params', {
      nonce,
      server_nonce: serverNonce,
      p: new Hex(p),
      q: new Hex(q),
      public_key_fingerprint: publicKeyFingerprint,
      encrypted_data: new Hex(publicKey && RSAEncrypt(dataWithHash, publicKey.n, publicKey.e)),
    });

    const [resDH] = await this.transport.callPlain(reqDH);

    if (resDH.declaration.predicate !== 'server_DH_params_ok') {
      throw new Error(`Auth: Unexpected req_DH_params response. Got ${resDH.declaration.predicate}`);
    }

    const tmpAesKey = Hex.concat(
      SHA1.Hex(Hex.concat(newNonce, serverNonce)),
      SHA1.Hex(Hex.concat(serverNonce, newNonce)).sliceBytes(0, 12),
    );

    const tmpAesIv = Hex.concat(
      SHA1.Hex(Hex.concat(serverNonce, newNonce)).sliceBytes(12, 20),
      SHA1.Hex(Hex.concat(newNonce, newNonce)),
      newNonce.sliceBytes(0, 4),
    );

    const decryptedAnswer = AESDecrypt(resDH.params.encrypted_answer.getHex(), tmpAesKey, tmpAesIv);

    const serverDH = this.tl.parse(decryptedAnswer.sliceBytes(20).toBuffer());

    // To Do: server time sync

    const g = BigInt(serverDH.params.g.getValue());
    const ga = BigInt(serverDH.params.g_a.getHex(), 16);
    const dhPrime = BigInt(serverDH.params.dh_prime.getHex(), 16);
    const b = BigInt.randBetween('-1e256', '1e256'); // BigInt(Hex.random(256), 16);
    const gb = g.modPow(b, dhPrime);

    // TO DO: check dh prime, ga, gb

    const clientDH = this.tl.construct('client_DH_inner_data', {
      nonce,
      server_nonce: serverNonce,
      g_b: new Hex(gb.toString(16)),
    });

    const dataDH = clientDH.serialize().toHex();
    const dataDHhash = SHA1.Hex(dataDH);
    const dataDHwithHash = new Hex(dataDHhash + dataDH + Hex.random(16 - ((dataDH.byteLength + dataDHhash.byteLength) % 16)));

    const reqSetDH = this.tl.query('set_client_DH_params', {
      nonce,
      server_nonce: serverNonce,
      encrypted_data: AESEncrypt(dataDHwithHash, tmpAesKey, tmpAesIv),
    });

    const [statusDH] = await this.transport.callPlain(reqSetDH);

    if (statusDH.declaration.predicate !== 'dh_gen_ok') {
      throw new Error(`Auth: Unexpected set_client_DH_params response. Got ${statusDH.declaration.predicate}`);
    }

    const authKey = ga.modPow(b, dhPrime).toString(16);

    if (isTemporary) this.transport.services.session.serverSalt = Hex.xor(newNonce.sliceBytes(0, 8), serverNonce.sliceBytes(0, 8));

    if (isTemporary) {
      this.tempKey = authKey;
      this.tempKeyExpire = getTime().second + expiresAfter;
    } else {
      this.permKey = authKey;
    }

    log(`${isTemporary ? 'temporary' : 'permanent'} key created`);

    return authKey;
  }

  /**
   * Binds temp auth key to permenent
   * Ref: https://core.telegram.org/method/auth.bindTempAuthKey
   * @param {string} permanent Permenent Auth Key
   * @param {string} temporary Temporary Auth key
   * @param {number} expiresAfter Expires after in seconds
   */
  async bindTempAuthKey() {
    log('binding temporary key');

    const permAuthKeyID = this.keys.permanent.id;
    const tempAuthKeyID = this.keys.temporary.id;

    const sessionID = Hex.random(8);
    const nonce = Hex.random(8);
    const expiresAt = this.keys.temporary.expires;

    this.transport.services.session.sessionID = sessionID;
    this.transport.services.session.expires = expiresAt;

    const msgID = MessageData.GenerateID();

    const bindMsg = new MessageData(this.tl.query('bind_auth_key_inner', {
      nonce,
      temp_auth_key_id: tempAuthKeyID,
      perm_auth_key_id: permAuthKeyID,
      temp_session_id: sessionID,
      expires_at: expiresAt,
    }).serialize(), true)
      .setSalt(Hex.random(8))
      .setSessionID(Hex.random(8))
      .setMessageID(msgID)
      .setLength()
      .setPadding();

    const query = this.tl.query('auth.bindTempAuthKey', {
      perm_auth_key_id: permAuthKeyID,
      nonce,
      expires_at: expiresAt,
      encrypted_message: encryptDataMessage(this.permKey, bindMsg).toHex(),
    });

    const [res] = await this.transport.call(query, { msgID });

    if (res.json() !== true) {
      throw new Error('Auth: Binding temp auth key failed');
    }

    this.tempKeyBinding = true;

    log('temporary key successfuly binded');
  }
}
