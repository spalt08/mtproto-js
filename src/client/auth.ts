import { Client } from '.';
import { TLConstructor } from '../tl';
import async from '../crypto/async';
import { PredefinedKeys, RSAKey } from '../crypto/rsa/keys';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import { MessageV1, PlainMessage } from '../message';

const log = logs('auth');

export type AuthKey = {
  key: string,
  id: string,
  expires?: number,
  binded?: boolean,
};

type Headers = {
  dc: number,
  thread: number,
  transport?: string,
};

/**
 * @mtproto req_pq_multi
 */
function authReqPQ(client: Client, h: Headers, nonce: string, cb: (success: boolean, result?: any) => void) {
  client.plainCall('req_pq_multi nonce:int128 = ResPQ', { nonce }, h, (err, resPQ) => {
    if (err || !(resPQ instanceof TLConstructor) || resPQ._ !== 'resPQ') {
      log(h.dc, h.thread, 'Unexpected resPQ response');
      console.log(err, resPQ);

      cb(false);
      return;
    }

    cb(true, resPQ.json());
  });
}

/**
 * Find RSA key by fingerprint
 */
function matchPublicKey(fingerprints: string[]): RSAKey | undefined {
  for (let i = 0; i < fingerprints.length; i += 1) {
    const item = fingerprints[i];
    for (let j = 0; j < PredefinedKeys.length; j += 1) {
      if (PredefinedKeys[j].fingerprint === item) {
        return PredefinedKeys[j];
      }
    }
  }

  return undefined;
}

/**
 * @mtproto req_DH_params
 */
function authReqDHParams(client: Client, h: Headers, nn: string, resPQ: any, expiresAfter: number, cb: (success: boolean, result?: any) => void) {
  const { pq, nonce } = resPQ;

  // factorize PQ
  async('factorize', pq, ([p, q]: string[]) => {
    const publicKey = matchPublicKey(resPQ.server_public_key_fingerprints);

    if (!publicKey) {
      log(h.dc, h.thread, 'Unknown RSA public key fingerprint:', resPQ.server_public_key_fingerprints.join(', '));
      cb(false);
      return;
    }

    const pqInner = client.tl.create(expiresAfter > 0 ? 'p_q_inner_data_temp' : 'p_q_inner_data', {
      pq,
      p,
      q,
      nonce,
      server_nonce: resPQ.server_nonce,
      new_nonce: nn,
    });

    if (expiresAfter > 0) pqInner.params.expires_in.value = expiresAfter;

    // Encrypt pq_inner_data
    async('encrypt_pq', [pqInner.serialize(), publicKey], (encryptedPQ: string) => {
      if (encryptedPQ.length <= 510) {
        do {
          encryptedPQ = '00' + encryptedPQ; // eslint-disable-line
        } while (encryptedPQ.length <= 510);
      }

      const dhParams = {
        nonce,
        server_nonce: resPQ.server_nonce,
        p,
        q,
        public_key_fingerprint: publicKey.fingerprint,
        encrypted_data: encryptedPQ,
      };

      // call req_DH_params
      client.plainCall('req_DH_params', dhParams, h, (errd, resDH) => {
        if (errd || !(resDH instanceof TLConstructor) || resDH._ !== 'server_DH_params_ok') {
          log(h.dc, h.thread, 'Unexpected req_DH_params response');
          cb(false);
          return;
        }

        // decrypt encrypted_answer
        async('decrypt_dh', [resDH.params.encrypted_answer.value, nn, resPQ.server_nonce], (decryptedDH: Bytes) => {
          const serverDH = client.tl.parse(decryptedDH.slice(20));

          if (!(serverDH instanceof TLConstructor) || serverDH._ !== 'server_DH_inner_data') {
            log(h.dc, h.thread, 'Unable to decrypt aes-256-ige');
            cb(false);
            return;
          }

          cb(true, serverDH.json());
        });
      });
    });
  });
}

type SetClientDHParamsCallback = (success: boolean, authKey?: AuthKey) => void;

/**
 * @mtproto set_client_DH_params
 */
function authSetClientDHParams(client: Client, h: Headers, nn: string, resPQ: any, serverDH: any, cb: SetClientDHParamsCallback) {
  async('gen_key', [serverDH.g, serverDH.ga, serverDH.dhPrime], ([gb, key, id]: string[]) => {
    const clientDH = client.tl.create('client_DH_inner_data', {
      nonce: resPQ.nonce,
      server_nonce: resPQ.server_nonce,
      retry_id: 0,
      g_b: gb,
    }).serialize();

    async('encrypt_dh', [clientDH.hex, nn, resPQ.server_nonce], (encryptedDH: string) => {
      const clientDHParams = {
        nonce: resPQ.nonce,
        server_nonce: resPQ.server_nonce,
        encrypted_data: encryptedDH,
      };

      client.plainCall('set_client_DH_params', clientDHParams, h, (err, sDH) => {
        if (err || !(sDH instanceof TLConstructor) || sDH._ !== 'dh_gen_ok') {
          log(h.dc, h.thread, 'Unexpected set_client_DH_params response');
          cb(false);
          return;
        }

        cb(true, { id, key });
      });
    });
  });
}

/**
 * Creates AuthKey using DH-exchange
 * Ref: https://core.telegram.org/mtproto/auth_key
 */
export function createAuthKey(client: Client, dc: number, thread: number, expiresAfter: number, cb: (err: boolean, key?: AuthKey) => void) {
  // handshaking meta
  const headers = { dc, thread, transport: 'websocket' };
  const nonce = new Bytes(16).randomize().uint as string;
  const newNonce = new Bytes(32).randomize().uint as string;

  log(dc, `creating ${expiresAfter > 0 ? 'temporary' : 'permanent'} key (${headers.transport}, thread: ${thread})`);

  // call req_pq_multi
  authReqPQ(client, headers, nonce, (success, resPQ) => {
    if (success === false) {
      cb(false);
      return;
    }

    // call req_DH_params
    authReqDHParams(client, headers, newNonce, resPQ, expiresAfter, (rsuccess, serverDH) => {
      if (rsuccess === false) {
        cb(false);
        return;
      }

      // todo: server time sync
      // todo: check dh prime, ga, gb

      authSetClientDHParams(client, headers, newNonce, resPQ, serverDH, (csuccess: boolean, authKey?: AuthKey) => {
        if (csuccess === false || !authKey) {
          cb(false);
          return;
        }

        if (expiresAfter > 0) {
          authKey.expires = Math.floor(Date.now() / 1000) + expiresAfter;
          authKey.binded = false;

          client.svc.setMeta(dc, 'salt', Bytes.xor(hex(newNonce), hex(resPQ.server_nonce)).hex);
        }

        log(dc, `${expiresAfter > 0 ? 'temporary' : 'permanent'} key created (${headers.transport}, thread: ${thread})`);

        if (cb) cb(false, authKey);
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
