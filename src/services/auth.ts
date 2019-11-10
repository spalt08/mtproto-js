import BigInt from 'big-integer';
import Transport from '../transport/abstract';
import async from '../crypto/async';
import TypeLanguage, { TLConstructor, TLVector } from '../tl';
import { PredefinedKeys, RSAKey } from '../crypto/rsa/keys';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import sha1 from '../crypto/sha1';
import { MessageV1, PlainMessage } from '../message';
import { encryptMessageV1 } from '../crypto/aes/message.v1';

const log = logs('auth');

export type AuthKey = {
  key: string,
  id: string,
  expires?: number,
  binded?: boolean,
};

/**
 * Service class helper for authorization stuff
 */
export default class AuthService {
  expireDefault = 3600 * 2;

  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /**
   * Authorization keys
   * Ref: https://core.telegram.org/mtproto/auth_key
   */
  keys: Record<number, AuthKey> = {};

  tempKey: string = '';

  /** RSA Keys */
  RSAKeys: Array<RSAKey>;

  /**
   * Creates auth service object
   */
  constructor(transport: Transport, tl: TypeLanguage) {
    this.tl = tl;
    this.transport = transport;

    this.RSAKeys = [...PredefinedKeys];
  }

  /**
   * Creates AuthKey using DH-exchange
   * Ref: https://core.telegram.org/mtproto/auth_key
   */
  createAuthKey(dcID: number, expiresAfter: number, cb: (key: AuthKey) => void) {
    log(dcID, `creating ${expiresAfter > 0 ? 'temporary' : 'permanent'} key`);

    const nonce = new Bytes(16).randomize();
    const newNonce = new Bytes(32).randomize();

    this.transport.plainCall('req_pq_multi nonce:int128 = ResPQ', { nonce: nonce.uint }, { dcID }, (err, resPQ) => {
      if (err || !(resPQ instanceof TLConstructor) || resPQ._ !== 'resPQ') throw new Error('Auth: Unexpected resPQ response');

      const serverNonce = resPQ.params.server_nonce.buf!;
      const pq = resPQ.params.pq.value;

      async('factorize', pq, (res) => {
        const [p, q] = res;

        let fingerprint: number = 0;
        let publicKey: RSAKey | undefined;

        const fingerprints = resPQ.params.server_public_key_fingerprints as TLVector;

        for (let i = 0; i < fingerprints.items.length; i += 1) {
          const item = fingerprints.items[i];
          for (let j = 0; j < this.RSAKeys.length; j += 1) {
            if (this.RSAKeys[j].fingerprint === item.buf!.hex) {
              fingerprint = item.value;
              publicKey = this.RSAKeys[j];
              break;
            }
          }

          if (fingerprint) break;
        }

        if (!fingerprint || !publicKey) throw new Error('Auth Service: Unknown RSA public key fingerprint');

        const pqInner = this.tl.create(expiresAfter > 0 ? 'p_q_inner_data_temp' : 'p_q_inner_data', {
          pq,
          p,
          q,
          nonce: nonce.uint,
          server_nonce: serverNonce.uint,
          new_nonce: newNonce.uint,
        });

        if (expiresAfter > 0) pqInner.params.expires_in.value = expiresAfter;

        const data = pqInner.serialize().hex;

        async('encrypt_pq', [data, publicKey], (encryptedPQ: string) => {
          const dhParams = {
            nonce: nonce.uint,
            server_nonce: serverNonce.uint,
            p,
            q,
            public_key_fingerprint: fingerprint,
            encrypted_data: encryptedPQ,
          };

          this.transport.plainCall('req_DH_params', dhParams, { dcID }, (errd, resDH) => {
            if (errd || !(resDH instanceof TLConstructor) || resDH._ !== 'server_DH_params_ok') {
              throw new Error('Auth: Unexpected req_DH_params response');
            }

            async('decrypt_dh', [resDH.params.encrypted_answer.value, newNonce.hex, serverNonce.hex], (decryptedDH: string) => {
              const serverDH = this.tl.parse(hex(decryptedDH).slice(20));

              if (!(serverDH instanceof TLConstructor) || serverDH._ !== 'server_DH_inner_data') throw new Error('Unable to decrypt aes-256-ige');

              // todo: server time sync

              const g = BigInt(serverDH.params.g.value);
              const ga = BigInt(serverDH.params.g_a.value, 16);
              const dhPrime = BigInt(serverDH.params.dh_prime.value, 16);
              const b = BigInt(new Bytes(255).randomize().hex, 16);

              const gb = g.modPow(b, dhPrime);

              // todo: check dh prime, ga, gb

              const clientDH = this.tl.create('client_DH_inner_data', {
                nonce: nonce.uint,
                server_nonce: serverNonce.uint,
                retry_id: 0,
                g_b: gb.toString(16),
              }).serialize();

              async('encrypt_dh', [clientDH.hex, newNonce.hex, serverNonce.hex], (encryptedDH: string) => {
                const clientDHParams = {
                  nonce: nonce.uint,
                  server_nonce: serverNonce.uint,
                  encrypted_data: encryptedDH,
                };

                this.transport.plainCall('set_client_DH_params', clientDHParams, { dcID }, (errc, sDH) => {
                  if (errc || !(sDH instanceof TLConstructor) || sDH._ !== 'dh_gen_ok') {
                    throw new Error('Auth Service: Unexpected set_client_DH_params response');
                  }

                  const authKeyFull = ga.modPow(b, dhPrime).toString(16);
                  const authKey: AuthKey = {
                    id: sha1(hex(authKeyFull)).slice(12, 20).hex,
                    key: authKeyFull,
                  };

                  if (expiresAfter > 0) {
                    authKey.expires = Math.floor(Date.now() / 1000) + expiresAfter;
                    authKey.binded = false;

                    this.transport.dc.setMeta(dcID, 'salt', Bytes.xor(newNonce.reverse().slice(0, 8), serverNonce.reverse().slice(0, 8)).hex);
                  }

                  this.transport.dc.setMeta(dcID, 'tempKey', authKey);

                  log(dcID, `${expiresAfter > 0 ? 'temporary' : 'permanent'} key created`);

                  if (cb) cb(authKey);
                });
              });
            });
          });
        });
      });
    });
  }

  /**
   * Binds temp auth key to permenent
   * Ref: https://core.telegram.org/method/auth.bindTempAuthKey
   */
  bindTempAuthKey(dc: number, permKey: AuthKey, tempKey: AuthKey) {
    log(dc, 'binding temporary key');

    this.tempKey = tempKey.key;

    const permAuthKeyID = hex(permKey.id).uint;
    const tempAuthKeyID = hex(tempKey.id).uint;

    const nonce = new Bytes(8).randomize().uint;
    const tmpSessionID = new Bytes(8).randomize();
    const expiresAt = tempKey.expires;
    const msgID = PlainMessage.GenerateID();

    this.transport.dc.setMeta(dc, 'sessionID', tmpSessionID.hex);

    const q = this.tl.create('bind_auth_key_inner', {
      nonce,
      temp_auth_key_id: tempAuthKeyID,
      perm_auth_key_id: permAuthKeyID,
      temp_session_id: tmpSessionID.uint,
      expires_at: expiresAt,
    });

    const bindMsg = new MessageV1(q);

    bindMsg.salt = new Bytes(8).randomize().hex;
    bindMsg.sessionID = new Bytes(8).randomize().hex;
    bindMsg.id = msgID;

    const query = this.tl.create('auth.bindTempAuthKey', {
      perm_auth_key_id: permAuthKeyID,
      nonce,
      expires_at: expiresAt,
      encrypted_message: encryptMessageV1(permKey, bindMsg).buf.hex,
    });

    this.transport.call(query, { msgID }, (err, res) => {
      if (!err && res && res.json() === true) {
        log(dc, 'temporary key successfuly binded');
      } else {
        throw new Error('Auth: Binding temp auth key failed');
      }
    });
  }
}
