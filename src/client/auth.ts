/* eslint-disable prefer-destructuring */
import BigInt from 'big-integer';
import sha1 from '@cryptography/sha1';
import { IGE } from '@cryptography/aes';
import { TLConstructor } from '../tl';
import { getKeyByFingerprints } from '../crypto/rsa/keys';
import { logs } from '../utils/log';
import { Bytes, hex, randomize, i2h, i2ab, Reader32, ab2i } from '../serialization';
import { MessageV1, PlainMessage } from '../message';
import { BrentPrime } from '../crypto/pq';
import RSAEncrypt from '../crypto/rsa/encrypt';
import { ClientError, AuthKey, ClientInterface } from './types';
import { hex2raw } from '../serialization/conv';

const log = logs('auth');

type AuthContext = {
  dc: number,
  thread: number,
  transport: string,
  expiresAfter: number,
  nonce: Uint32Array,
  serverNonce?: Uint32Array,
  pq?: Uint8Array,
  fingerprints?: string[],
  newNonce: Uint32Array,
  aesKey?: Uint32Array,
  aesIv?: Uint32Array,
  cipher?: IGE,
  g?: number,
  ga?: Uint8Array,
  dh?: Uint8Array,
};

/**
 * Auth Flow
 * Step 1. Send random nonce.
 * @mtproto req_pq_multi
 */
function authReqPQ(client: ClientInterface, ctx: AuthContext, cb: (_err: ClientError | null, _result?: TLConstructor) => void) {
  client.plainCall('req_pq_multi nonce:int128 = ResPQ', { nonce: ctx.nonce }, ctx, (err, resPQ) => {
    if (err || !resPQ || resPQ._ !== 'resPQ') {
      log(ctx.dc, ctx.thread, 'Unexpected resPQ response');

      cb(err);
      return;
    }

    cb(null, resPQ as TLConstructor);
  });
}

/**
 * Auth Flow
 * Step 2. Request Diffie-Hellman params
 * @mtproto req_DH_params
 */
function authReqDHParams(client: ClientInterface, ctx: AuthContext, cb: (_err: ClientError | null, _result?: TLConstructor) => void) {
  // check context
  if (!ctx.pq || ctx.pq.length === 0) throw new Error('Auth: Missing PQ param');
  if (!ctx.fingerprints || ctx.fingerprints.length === 0) throw new Error('Auth: Missing public key fingerprints');
  if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');

  // factorize PQ and find RSA key
  const [p, q] = BrentPrime(BigInt.fromArray(Array.from(ctx.pq), 16));
  const publicKey = getKeyByFingerprints(ctx.fingerprints);

  if (!publicKey) {
    log(ctx.dc, ctx.thread, 'Unknown RSA public key fingerprint:', ctx.fingerprints.join(', '));
    cb({
      type: 'internal',
      code: 0,
      message: 'Unknown RSA public key fingerprint',
    });
    return;
  }

  // wrap p_q_inner_data
  const pqInner = client.tl.create(ctx.expiresAfter > 0 ? 'p_q_inner_data_temp' : 'p_q_inner_data', {
    pq: ctx.pq.buffer,
    p: new Uint32Array(p.toArray(16).value).buffer,
    q: new Uint32Array(q.toArray(16).value).buffer,
    nonce: ctx.nonce,
    server_nonce: ctx.serverNonce,
    new_nonce: ctx.newNonce,
  });

  if (ctx.expiresAfter > 0) pqInner.params.expires_in.value = ctx.expiresAfter;

  // encrypt pq_inner_data
  const data = pqInner.serialize();
  const dataToEncrypt = new Bytes(255);
  const dataBytes = new Bytes(new Uint8Array(i2ab(data)));
  dataToEncrypt.slice(0, 20).raw = sha1(data, 'binary');
  dataToEncrypt.slice(20, 20 + data.length).raw = dataBytes.raw;
  dataToEncrypt.slice(20 + data.length).randomize();

  let encryptedPQ = RSAEncrypt(dataToEncrypt.hex, publicKey.n, publicKey.e);

  // fix: length should be === 255;
  if (encryptedPQ.length <= 510) {
    do {
      encryptedPQ = '00' + encryptedPQ;
    } while (encryptedPQ.length <= 510);
  }

  const encryptedBytes = new Bytes(encryptedPQ.length / 2);
  encryptedBytes.hex = encryptedPQ;

  const dhParams = {
    nonce: ctx.nonce,
    server_nonce: ctx.serverNonce,
    p: new Uint32Array(p.toArray(16).value).buffer,
    q: new Uint32Array(q.toArray(16).value).buffer,
    public_key_fingerprint: publicKey.fingerprint,
    encrypted_data: encryptedBytes.buffer.buffer,
  };

  // call req_DH_params
  client.plainCall('req_DH_params', dhParams, ctx, (errd, resDH) => {
    if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');
    if (!ctx.cipher) throw new Error('Auth: Missing aes_key');

    if (errd || !resDH || resDH._ !== 'server_DH_params_ok') {
      log(ctx.dc, ctx.thread, 'Unexpected req_DH_params response');
      cb(errd);
      return;
    }

    // decrypt encrypted_answer
    const wrapper = resDH as TLConstructor;
    const decryptedDH = ctx.cipher.decrypt(new Uint8Array(wrapper.params.encrypted_answer.value));
    const serverDH = client.tl.parse(new Reader32(decryptedDH.subarray(5)));

    if (!(serverDH instanceof TLConstructor) || serverDH._ !== 'server_DH_inner_data') {
      log(ctx.dc, ctx.thread, 'Unable to decrypt aes-256-ige');
      cb({
        type: 'internal',
        code: 0,
        message: 'Unable to decrypt aes-256-ige',
      });
      return;
    }

    cb(null, serverDH as TLConstructor);
  });
}

/**
 * @mtproto set_client_DH_params
 */
function authSetClientDHParams(client: ClientInterface, ctx: AuthContext, cb: (_err: ClientError | null, authKey?: AuthKey) => void) {
  // check context
  if (!ctx.g) throw new Error('Auth: Missing g param');
  if (!ctx.ga || ctx.ga.length === 0) throw new Error('Auth: Missing g_a param');
  if (!ctx.dh || ctx.dh.length === 0) throw new Error('Auth: Missing dh_prime param');
  if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');
  if (!ctx.cipher) throw new Error('Auth: Missing aes_key');

  // generate key;
  const g = BigInt(ctx.g);
  const ga = BigInt.fromArray(Array.from(ctx.ga), 16);
  const dhPrime = BigInt.fromArray(Array.from(ctx.dh), 16);
  const b = BigInt(new Bytes(255).randomize().hex, 16);
  const gb = g.modPow(b, dhPrime).toString(16);
  const key = new Uint8Array(ga.modPow(b, dhPrime).toArray(16).value);

  // inner content for client_DH_inner_data
  const clientDH = client.tl.create('client_DH_inner_data', {
    nonce: ctx.nonce,
    server_nonce: ctx.serverNonce,
    retry_id: 0,
    g_b: hex2raw(gb),
  }).serialize();

  let len = 20 + clientDH.length * 4;
  len += 16 - (len % 16);

  const plain = new Uint32Array(len / 4);
  plain.set(sha1(clientDH), 0);
  plain.set(clientDH, 5);

  randomize(plain, 5 + clientDH.length);

  // encrypt client_DH_inner_data
  const encryptedDH = ctx.cipher.encrypt(plain);

  // params for set_client_DH_params
  const clientDHParams = {
    nonce: ctx.nonce,
    server_nonce: ctx.serverNonce,
    encrypted_data: i2ab(encryptedDH),
  };

  client.plainCall('set_client_DH_params', clientDHParams, ctx, (err, sDH) => {
    if (err || !sDH || sDH._ !== 'dh_gen_ok') {
      log(ctx.dc, ctx.thread, 'Unexpected set_client_DH_params response');
      cb(err);
      return;
    }

    const keyId = sha1(ab2i(key.buffer));
    cb(null, {
      id: i2h(keyId[3]) + i2h(keyId[4]),
      key: new Bytes(key).hex,
    });
  });
}

/**
 * Creates AuthKey using DH-exchange
 * Ref: https://core.telegram.org/mtproto/auth_key
 */
export function createAuthKey(client: ClientInterface, dc: number, thread: number, expiresAfter: number,
  cb?: (err: ClientError | null, key?: AuthKey) => void) {
  const ctx: AuthContext = {
    dc,
    thread,
    transport: 'websocket',
    expiresAfter,
    nonce: new Uint32Array(4),
    newNonce: new Uint32Array(8),
  };

  randomize(ctx.nonce);
  randomize(ctx.newNonce);

  log(dc, `creating ${expiresAfter > 0 ? 'temporary' : 'permanent'} key (${ctx.transport}, thread: ${ctx.thread})`);

  // call req_pq_multi
  authReqPQ(client, ctx, (err, resPQ) => {
    if (err || !resPQ) {
      if (cb) cb(err);
      return;
    }

    ctx.serverNonce = resPQ.params.server_nonce.value;
    ctx.fingerprints = resPQ.params.server_public_key_fingerprints.value;
    ctx.pq = new Uint8Array(resPQ.params.pq.value.slice(0));

    ctx.aesKey = new Uint32Array(8);
    ctx.aesIv = new Uint32Array(8);

    const sha1a = sha1.stream().update(ctx.newNonce).update(ctx.serverNonce!).digest();
    const sha1b = sha1.stream().update(ctx.serverNonce!).update(ctx.newNonce).digest();
    const sha1c = sha1.stream().update(ctx.newNonce).update(ctx.newNonce).digest();

    ctx.aesKey[0] = sha1a[0];
    ctx.aesKey[1] = sha1a[1];
    ctx.aesKey[2] = sha1a[2];
    ctx.aesKey[3] = sha1a[3];
    ctx.aesKey[4] = sha1a[4];
    ctx.aesKey[5] = sha1b[0];
    ctx.aesKey[6] = sha1b[1];
    ctx.aesKey[7] = sha1b[2];

    ctx.aesIv[0] = sha1b[3];
    ctx.aesIv[1] = sha1b[4];
    ctx.aesIv[2] = sha1c[0];
    ctx.aesIv[3] = sha1c[1];
    ctx.aesIv[4] = sha1c[2];
    ctx.aesIv[5] = sha1c[3];
    ctx.aesIv[6] = sha1c[4];
    ctx.aesIv[7] = ctx.newNonce[0];

    ctx.cipher = new IGE(ctx.aesKey, ctx.aesIv);

    // call req_DH_params
    authReqDHParams(client, ctx, (rerr, serverDH) => {
      if (rerr || !serverDH) {
        if (cb) cb(rerr);
        return;
      }

      // todo: server time sync
      // todo: check dh prime, ga, gb
      ctx.g = serverDH.params.g.value;
      ctx.ga = new Uint8Array(serverDH.params.g_a.value);
      ctx.dh = new Uint8Array(serverDH.params.dh_prime.value);

      authSetClientDHParams(client, ctx, (cerr, authKey) => {
        if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');

        if (cerr || !authKey) {
          if (cb) cb(cerr);
          return;
        }

        if (expiresAfter > 0) {
          authKey.expires = Math.floor(Date.now() / 1000) + expiresAfter;
          authKey.binded = false;

          ctx.serverNonce[0] ^= ctx.newNonce[0];
          ctx.serverNonce[1] ^= ctx.newNonce[1];

          client.dc.setMeta(dc, 'salt', i2h(ctx.serverNonce[0] ^ ctx.newNonce[0]) + i2h(ctx.serverNonce[1] ^ ctx.newNonce[1]));
        }

        if (expiresAfter > 0) client.dc.setMeta(dc, 'tempKey', authKey);
        else client.dc.setMeta(dc, 'permKey', authKey);

        log(dc, `${expiresAfter > 0 ? 'temporary' : 'permanent'} key created (${ctx.transport}, thread: ${thread})`);

        if (cb) cb(null, authKey);
      });
    });
  });
}

/**
 * Binds temp auth key to permenent
 * Ref: https://core.telegram.org/method/auth.bindTempAuthKey
 */
export function bindTempAuthKey(client: ClientInterface, dc: number, permKey: AuthKey, tempKey: AuthKey, cb?: (result: boolean) => void) {
  log(dc, 'binding temporary key');

  if (!permKey || !tempKey) throw new Error('Missing keys');

  const permAuthKeyID = hex(permKey.id).uint;
  const tempAuthKeyID = hex(tempKey.id).uint;

  const nonce = new Bytes(8).randomize().uint;
  const tmpSessionID = new Bytes(8).randomize();
  const expiresAt = tempKey.expires;
  const msgID = PlainMessage.GenerateID();

  client.dc.setMeta(dc, 'sessionID', tmpSessionID.hex);

  const q = client.tl.create('bind_auth_key_inner', {
    nonce,
    temp_auth_key_id: tempAuthKeyID,
    perm_auth_key_id: permAuthKeyID,
    temp_session_id: tmpSessionID.uint,
    expires_at: expiresAt,
  });

  const bindMsg = new MessageV1(q.serialize());

  bindMsg.salt = new Bytes(8).randomize().hex;
  bindMsg.sessionID = new Bytes(8).randomize().hex;
  bindMsg.id = msgID;

  const encryptedMsg = bindMsg.encrypt(permKey.key as any, permAuthKeyID as string);

  const query = client.tl.create('auth.bindTempAuthKey', {
    perm_auth_key_id: permAuthKeyID,
    nonce,
    expires_at: expiresAt,
    encrypted_message: i2ab(encryptedMsg.buf),
  });

  client.call(query, { msgID, dc, force: true }, (err, res) => {
    if (!err && res && res.json() === true) {
      log(dc, 'temporary key successfuly binded');
      client.dc.setMeta(dc, 'tempKey', { ...tempKey, binded: true });
      if (cb) cb(true);
    } else {
      throw new Error('Auth: Binding temp auth key failed');
    }
  });
}

/**
 * Calls initConnection method invoked with layer
 */
export function initConnection(client: ClientInterface, dc: number, cb?: (result: boolean) => void) {
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
    if (err || !res) {
      log('Unexpected initConnection response');
      if (cb) cb(false);
    } else {
      client.dc.setMeta(dc, 'connectionInited', true);
      log('session successfuly inited');
      if (cb) cb(true);
    }
  });
}

/**
 * Calls auth.exportAuthorization and auth.importAuthorization from one dc to another
 */
export function transferAuthorization(client: ClientInterface, userID: number, dcFrom: number, dcTo: number, cb?: (res: boolean) => void) {
  client.call('auth.exportAuthorization', { dc_id: dcTo }, { dc: dcFrom, force: true }, (err, res) => {
    if (err || !(res instanceof TLConstructor) || res._ !== 'auth.exportedAuthorization') {
      if (cb) cb(false);
      return;
    }

    const { bytes } = res.params;

    client.call('auth.importAuthorization', { id: userID, bytes: bytes.value }, { dc: dcTo, force: true }, (err2, res2) => {
      if (err2 || !(res2 instanceof TLConstructor) || res2._ !== 'auth.authorization') {
        if (cb) cb(false);
        return;
      }

      if (cb) cb(true);
    });
  });
}
