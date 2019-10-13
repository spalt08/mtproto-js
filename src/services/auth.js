// @flow

import BigInt from 'big-integer';

import type { Transport, DataStorage } from '../interfaces';

import TypeLanguage from '../typeLanguage';
import { Hex, MessageData } from '../serialization';
import pqPrimePollard from '../crypto/pq';
import { PredefinedKeys } from '../crypto/rsa/keys';
import RSAEncrypt from '../crypto/rsa/encrypt';
import AESDecrypt from '../crypto/aes/decrypt';
import AESEncrypt from '../crypto/aes/encrypt';
import { encryptDataMessage } from '../crypto/aes/message';
import SHA1 from '../crypto/sha1';
import getTime from '../utils/timer';

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
  authKeys: {
    permanent: {
      key: ?Hex,
      id: ?Hex,
    },
    temporary: {
      key: ?Hex,
      id: ?Hex,
    },
  };

  /** RSA Keys */
  RSAKeys: Array<{
    fingerprint: string,
    n: string,
    e: string,
  }>

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

    const tempKey = this.storage.load('auth', 'authKeyTemp');
    const permKey = this.storage.load('auth', 'authKeyPerm');

    this.authKeys = {
      temporary: tempKey ? {
        key: new Hex(tempKey),
        id: SHA1.Hex(new Hex(tempKey)).sliceBytes(-8),
      } : { key: undefined, id: undefined },
      permanent: permKey ? {
        key: new Hex(permKey),
        id: SHA1.Hex(new Hex(permKey)).sliceBytes(-8),
      } : { key: undefined, id: undefined },
    };

    this.RSAKeys = [...PredefinedKeys];
  }

  /**
   * Gets temporary authorization key object
   * @returns {{ key: Hex, id: Hex }} Temporary authorization key and it's ID
   */
  get tempKey(): { key: Hex, id: Hex } {
    return this.authKeys.temporary;
  }

  /**
   * Sets temporary authorization key
   * @param {string} key Temporary authorization key
   */
  set tempKey(key: string) {
    const hexKey = new Hex(key);

    this.storage.save('auth', 'authKeyTemp', hexKey.toString());

    this.authKeys.temporary = {
      key: hexKey,
      id: SHA1.Hex(hexKey).sliceBytes(-8),
    };
  }

  /**
   * Gets permanent authorization key object
   * @returns {{ key: Hex, id: Hex }} Permanent authorization key and it's ID
   */
  get permKey(): { key: Hex, id: Hex } {
    return this.authKeys.permanent;
  }

  /**
   * Sets permanent authorization key
   * @param {string} key Permanent authorization key
   */
  set permKey(key: string) {
    const hexKey = new Hex(key);

    this.storage.save('auth', 'authKeyPerm', hexKey.toString());

    this.authKeys.permanent = {
      key: hexKey,
      id: SHA1.Hex(hexKey).sliceBytes(-8),
    };
  }

  /**
   * Creates temporary and permanent auth keys and binds it togher
   * Ref: https://core.telegram.org/mtproto/auth_key
   * @returns {{ [string]: { key: Hex, id: Hex }} Permanent and temporary auth keys
   */
  async createAuthKeys(): { [string]: { key: Hex, id: Hex } } {
    const expiresIn = 3600 * 24 * 7;

    return Promise.all([
      this.createAuthKey(),
      this.createAuthKey(true, expiresIn),
    ]).then(
      ([permanent, temporary]) => {
        this.bindTempAuthKey(expiresIn);
        return { permanent, temporary };
      },
    );
  }

  /**
   * Creates AuthKey using DH-exchange
   * Ref: https://core.telegram.org/mtproto/auth_key
   * @param {boolean} isTemporary Flag for temporary key generation
   * @param {number} expiresAfter Time to expire temporary key in seconds
   * @returns {string} Temporary or permanent auth key
   */
  async createAuthKey(isTemporary?: boolean = false, expiresAfter?: number = 3600 * 24 * 7) {
    const nonce = Hex.random(16);
    const newNonce = Hex.random(32);

    const reqPQ = this.tl.query('req_pq_multi#be7e8ef1 nonce:int128 = ResPQ', { nonce });
    const resPQ = await this.transport.callPlain(reqPQ);

    if (resPQ.declaration.predicate !== 'resPQ') throw new Error(`Auth: Unexpected resPQ response. Got ${resPQ.declaration.predicate}`);

    const serverNonce = resPQ.params.server_nonce.getHex();

    const pq = resPQ.params.pq.getHex();
    const [p, q] = pqPrimePollard(pq);

    let publicKeyFingerprint: number;
    let publicKey;

    for (let i = 0; i < resPQ.params.server_public_key_fingerprints.items.length; i += 1) {
      const publicKeyFingerprintHex = resPQ.params.server_public_key_fingerprints.items[i].getHex().toString();
      publicKey = this.RSAKeys.find((k) => k.fingerprint === publicKeyFingerprintHex);

      if (publicKey) {
        publicKeyFingerprint = resPQ.params.server_public_key_fingerprints.items[i].getValue();
        break;
      }
    }

    if (!publicKey && publicKeyFingerprint) throw new Error(`RSA: Unknown public key fingerprint ${publicKeyFingerprint}`);

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
      encrypted_data: new Hex(RSAEncrypt(dataWithHash, publicKey.n, publicKey.e)),
    });

    const resDH = await this.transport.callPlain(reqDH);

    if (resDH.declaration.predicate !== 'server_DH_params_ok') {
      throw new Error(`Auth: Unexpected req_DH_params response. Got ${resDH.declaration.predicate}`);
    }

    const tmpAesKey = new Hex(SHA1.Hex(Hex.concat(newNonce, serverNonce)) + SHA1.Hex(Hex.concat(serverNonce, newNonce)).sliceBytes(0, 12));
    const tmpAesIv = new Hex(SHA1.Hex(Hex.concat(serverNonce, newNonce)).sliceBytes(12, 20)
                   + SHA1.Hex(Hex.concat(newNonce, newNonce)) + newNonce.sliceBytes(0, 4));

    const decryptedAnswer = AESDecrypt(resDH.params.encrypted_answer.getHex(), tmpAesKey, tmpAesIv);

    const serverDH = this.tl.parse(decryptedAnswer.sliceBytes(20).toBuffer());

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

    const statusDH = await this.transport.callPlain(reqSetDH);

    if (statusDH.declaration.predicate !== 'dh_gen_ok') {
      throw new Error(`Auth: Unexpected set_client_DH_params response. Got ${statusDH.declaration.predicate}`);
    }

    const authKey = ga.modPow(b, dhPrime).toString(16);

    if (isTemporary) {
      this.tempKey = authKey;
    } else {
      this.permKey = authKey;
    }

    return authKey;
  }

  /**
   * Binds temp auth key to permenent
   * Ref: https://core.telegram.org/method/auth.bindTempAuthKey
   * @param {string} permanent Permenent Auth Key
   * @param {string} temporary Temporary Auth key
   * @param {number} expiresAfter Expires after in seconds
   */
  async bindTempAuthKey(expiresAfter?: number = 3600 * 24 * 7) {
    // const premAuthKeyID = this.authKeys.permanent.id;
    // const tempAuthKeyID = this.authKeys.temporary.id;

    // const sessionID = Hex.random(8);
    // const salt = this.transport.getServerSalt();
    // const nonce = Hex.random(8);
    // const expiresAt = getTime().second + expiresAfter;

    // this.transport.setSession(sessionID);

    // const bindInner = this.tl.construct('bind_auth_key_inner', {
    //   nonce,
    //   temp_auth_key_id: tempAuthKeyID,
    //   perm_auth_key_id: premAuthKeyID,
    //   temp_session_id: sessionID,
    //   expires_at: expiresAt,
    // });

    // const bindMsg = new MessageData(bindInner.serialize());

    // bindMsg.setSalt(salt);
    // bindMsg.setSessionID(sessionID);
    // bindMsg.setMessageID();
    // bindMsg.setLength();
    // bindMsg.setPadding();

    // const msgID = bindMsg.getMessageID();

    // const bindQuery = this.tl.query('auth.bindTempAuthKey', {
    //   perm_auth_key_id: premAuthKeyID,
    //   nonce,
    //   expires_at: expiresAt,
    //   encrypted_message: encryptDataMessage(this.authKeys.permanent, bindMsg).toHex(),
    // });

    // const queryMsg = new MessageData(bindQuery.serialize());

    // queryMsg.setSessionID(sessionID);
    // queryMsg.setSalt(salt);
    // queryMsg.setSequenceNum(1);
    // queryMsg.setMessageID(msgID);
    // queryMsg.setLength();
    // queryMsg.setPadding();

    // const res = await this.transport.send(encryptDataMessage(this.authKeys.temporary, queryMsg));

    // console.log('bindKeyRes:', res);

    // this.transport.initConnection();
  }
}
