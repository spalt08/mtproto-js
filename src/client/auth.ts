import { Client } from '.';
import { TLConstructor, TLVector } from '../tl';
import async from '../crypto/async';
import { PredefinedKeys, RSAKey } from '../crypto/rsa/keys';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import sha1 from '../crypto/sha1';
import { MessageV1, PlainMessage } from '../message';

const log = logs('auth');

export type AuthKey = {
  key: string,
  id: string,
  expires?: number,
  binded?: boolean,
};

/**
 * Creates AuthKey using DH-exchange
 * Ref: https://core.telegram.org/mtproto/auth_key
 */
export function createAuthKey(client: Client, dc: number, thread: number, expiresAfter: number, cb?: (err: boolean, key?: AuthKey) => void) {
  // transport for handshaking
  const transport = 'websocket';
  const nonce = new Bytes(16).randomize();
  const newNonce = new Bytes(32).randomize();

  log(dc, `creating ${expiresAfter > 0 ? 'temporary' : 'permanent'} key (${transport}, thread: ${thread})`);

  client.plainCall('req_pq_multi nonce:int128 = ResPQ', { nonce: nonce.uint }, { dc, thread, transport }, (err, resPQ) => {
    if (err || !(resPQ instanceof TLConstructor) || resPQ._ !== 'resPQ') {
      log(dc, 'Unexpected resPQ response');
      if (cb) cb(true);
      return;
    }

    const serverNonce = resPQ.params.server_nonce.buf!;
    const pq = resPQ.params.pq.value;

    async('factorize', pq, (res) => {
      const [p, q] = res;

      let fingerprint: number = 0;
      let publicKey: RSAKey | undefined;

      const fingerprints = resPQ.params.server_public_key_fingerprints as TLVector;

      for (let i = 0; i < fingerprints.items.length; i += 1) {
        const item = fingerprints.items[i];
        for (let j = 0; j < PredefinedKeys.length; j += 1) {
          if (PredefinedKeys[j].fingerprint === item.buf!.hex) {
            fingerprint = item.value;
            publicKey = PredefinedKeys[j];
            break;
          }
        }

        if (fingerprint) break;
      }

      if (!fingerprint || !publicKey) {
        log(dc, 'Unknown RSA public key fingerprint');
        if (cb) cb(true);
        return;
      }

      const pqInner = client.tl.create(expiresAfter > 0 ? 'p_q_inner_data_temp' : 'p_q_inner_data', {
        pq,
        p,
        q,
        nonce: nonce.uint,
        server_nonce: serverNonce.uint,
        new_nonce: newNonce.uint,
      });

      if (expiresAfter > 0) pqInner.params.expires_in.value = expiresAfter;

      async('encrypt_pq', [pqInner.serialize(), publicKey], (encryptedPQ: string) => {
        const dhParams = {
          nonce: nonce.uint,
          server_nonce: serverNonce.uint,
          p,
          q,
          public_key_fingerprint: fingerprint,
          encrypted_data: encryptedPQ,
        };

        client.plainCall('req_DH_params', dhParams, { dc, thread, transport }, (errd, resDH) => {
          if (errd || !(resDH instanceof TLConstructor) || resDH._ !== 'server_DH_params_ok') {
            log('Unexpected req_DH_params response');
            if (cb) cb(true);
            return;
          }

          async('decrypt_dh', [resDH.params.encrypted_answer.value, newNonce, serverNonce], (decryptedDH: Bytes) => {
            const serverDH = client.tl.parse(decryptedDH.slice(20));

            if (!(serverDH instanceof TLConstructor) || serverDH._ !== 'server_DH_inner_data') {
              log('Unable to decrypt aes-256-ige');
              if (cb) cb(true);
              return;
            }

            // todo: server time sync
            const g = serverDH.params.g.value;
            const ga = serverDH.params.g_a.value;
            const dhPrime = serverDH.params.dh_prime.value;
            // todo: check dh prime, ga, gb

            async('gen_key', [g, ga, dhPrime], ([gb, authKeyFull]: string[]) => {
              const clientDH = client.tl.create('client_DH_inner_data', {
                nonce: nonce.uint,
                server_nonce: serverNonce.uint,
                retry_id: 0,
                g_b: gb,
              }).serialize();

              async('encrypt_dh', [clientDH, newNonce, serverNonce], (encryptedDH: string) => {
                const clientDHParams = {
                  nonce: nonce.uint,
                  server_nonce: serverNonce.uint,
                  encrypted_data: encryptedDH,
                };

                client.plainCall('set_client_DH_params', clientDHParams, { dc, thread, transport }, (errc, sDH) => {
                  if (errc || !(sDH instanceof TLConstructor) || sDH._ !== 'dh_gen_ok') {
                    log('Unexpected set_client_DH_params response');
                    if (cb) cb(true);
                    return;
                  }

                  const authKey: AuthKey = {
                    id: sha1(hex(authKeyFull).raw).slice(12, 20).hex,
                    key: authKeyFull,
                  };

                  if (expiresAfter > 0) {
                    authKey.expires = Math.floor(Date.now() / 1000) + expiresAfter;
                    authKey.binded = false;

                    client.svc.setMeta(dc, 'salt', Bytes.xor(newNonce.slice(0, 8), serverNonce.slice(0, 8)).hex);
                  }

                  if (expiresAfter > 0) client.svc.setMeta(dc, 'tempKey', authKey);
                  else client.svc.setMeta(dc, 'permKey', authKey);

                  log(dc, `${expiresAfter > 0 ? 'temporary' : 'permanent'} key created (${transport}, thread: ${thread})`);

                  if (cb) cb(false, authKey);
                });
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
export function bindTempAuthKey(client: Client, dc: number, permKey: AuthKey, tempKey: AuthKey, cb?: (result: boolean) => void) {
  log(dc, 'binding temporary key');

  const permAuthKeyID = hex(permKey.id).uint;
  const tempAuthKeyID = hex(tempKey.id).uint;

  const nonce = new Bytes(8).randomize().uint;
  const tmpSessionID = new Bytes(8).randomize();
  const expiresAt = tempKey.expires;
  const msgID = PlainMessage.GenerateID();

  client.svc.setMeta(dc, 'sessionID', tmpSessionID.hex);

  const q = client.tl.create('bind_auth_key_inner', {
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

  async('transport_encrypt_v1', { msg: bindMsg, authKey: permKey.key }, (encryptedMsg: Bytes) => {
    const query = client.tl.create('auth.bindTempAuthKey', {
      perm_auth_key_id: permAuthKeyID,
      nonce,
      expires_at: expiresAt,
      encrypted_message: encryptedMsg.hex,
    });

    client.call(query, { msgID, dc, force: true }, (err, res) => {
      if (!err && res && res.json() === true) {
        log(dc, 'temporary key successfuly binded');
        client.svc.setMeta(dc, 'tempKey', { ...tempKey, binded: true });
        if (cb) cb(true);
      } else {
        throw new Error('Auth: Binding temp auth key failed');
      }
    });
  });
}

/**
 * Calls initConnection method invoked with layer
 */
export function initConnection(client: Client, dc: number, cb?: (result: boolean) => void) {
  const query = client.tl.create('help.getNearestDc');

  const connectionWrapper = client.tl.create('initConnection', {
    api_id: client.cfg.APIID,
    device_model: client.cfg.deviceModel,
    system_version: client.cfg.systemVersion,
    app_version: client.cfg.appVersion,
    system_lang_code: client.cfg.langCode,
    lang_pack: '',
    lang_code: client.cfg.langCode,
    query,
  });

  const invokeWrapper = client.tl.create('invokeWithLayer', {
    layer: client.cfg.APILayer,
    query: connectionWrapper,
  });

  client.call(invokeWrapper, { dc, force: true }, (err, res) => {
    if (err || !res || !(res instanceof TLConstructor)) {
      log('Unexpected initConnection response');
      if (cb) cb(false);
    } else {
      client.svc.setMeta(dc, 'connectionInited', true);
      log('session successfuly inited');
      if (cb) cb(true);
    }
  });
}

export function transferAuthorization(client: Client, userID: number, dcFrom: number, dcTo: number, cb?: (res: boolean) => void) {
  client.call('auth.exportAuthorization', { dc_id: dcTo }, { dc: dcFrom, force: true }, (err, res) => {
    if (err || !(res instanceof TLConstructor) || res._ !== 'auth.exportedAuthorization') {
      if (cb) cb(false);
      return;
    }

    const bytes = res.params.bytes.value;

    client.call('auth.importAuthorization', { id: userID, bytes }, { dc: dcTo, force: true }, (err2, res2) => {
      if (err2 || !(res2 instanceof TLConstructor) || res2._ !== 'auth.authorization') {
        if (cb) cb(false);
        return;
      }

      if (cb) cb(true);
    });
  });
}
