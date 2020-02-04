import BigInt from 'big-integer';
import sha1 from '@cryptography/sha1';
import { Client } from '.';
import { TLConstructor } from '../tl';
import { getKeyByFingerprints } from '../crypto/rsa/keys';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import { MessageV1, PlainMessage } from '../message';
import { BrentPrime } from '../crypto/pq';
import RSAEncrypt from '../crypto/rsa/encrypt';
import { decrypt, encrypt } from '../crypto/ige';
import { ClientError, AuthKey } from './types';
import { raw2hex, hex2raw } from '../serialization/conv';

const log = logs('auth');

type AuthContext = {
  dc: number,
  thread: number,
  transport: string,
  expiresAfter: number,
  nonce: Bytes,
  serverNonce?: Bytes,
  pq?: string,
  fingerprints?: string[],
  newNonce: Bytes,
  aesKey?: Bytes,
  aesIv?: Bytes,
  g?: number,
  ga?: string,
  dh?: string,
};

/**
 * Auth Flow
 * Step 1. Send random nonce.
 * @mtproto req_pq_multi
 */
function authReqPQ(client: Client, ctx: AuthContext, cb: (_err: ClientError | null, _result?: any) => void) {
  client.plainCall('req_pq_multi nonce:int128 = ResPQ', { nonce: ctx.nonce.uint }, ctx, (err, resPQ) => {
    if (err || !resPQ || resPQ._ !== 'resPQ') {
      log(ctx.dc, ctx.thread, 'Unexpected resPQ response');

      cb(err);
      return;
    }

    cb(null, resPQ);
  });
}

/**
 * Auth Flow
 * Step 2. Request Diffie-Hellman params
 * @mtproto req_DH_params
 */
function authReqDHParams(client: Client, ctx: AuthContext, cb: (_err: ClientError | null, _result?: any) => void) {
  // check context
  if (!ctx.pq || ctx.pq.length === 0) throw new Error('Auth: Missing PQ param');
  if (!ctx.fingerprints || ctx.fingerprints.length === 0) throw new Error('Auth: Missing public key fingerprints');
  if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');

  // factorize PQ and find RSA key
  const [p, q] = BrentPrime(BigInt(ctx.pq, 16));
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
    pq: ctx.pq,
    p: p.toString(16),
    q: q.toString(16),
    nonce: ctx.nonce.uint,
    server_nonce: ctx.serverNonce.uint,
    new_nonce: ctx.newNonce.uint,
  });

  if (ctx.expiresAfter > 0) pqInner.params.expires_in.value = ctx.expiresAfter;

  // encrypt pq_inner_data
  const data = pqInner.serialize();
  const dataToEncrypt = new Bytes(255);

  dataToEncrypt.slice(0, 20).raw = sha1(data.raw);
  dataToEncrypt.slice(20, 20 + data.length).raw = data.raw;
  dataToEncrypt.slice(20 + data.length).randomize();

  let encryptedPQ = RSAEncrypt(dataToEncrypt.hex, publicKey.n, publicKey.e);

  // fix: length should be === 255;
  if (encryptedPQ.length <= 510) {
    do {
      encryptedPQ = '00' + encryptedPQ;
    } while (encryptedPQ.length <= 510);
  }

  const dhParams = {
    nonce: ctx.nonce.uint,
    server_nonce: ctx.serverNonce.uint,
    p: p.toString(16),
    q: q.toString(16),
    public_key_fingerprint: publicKey.fingerprint,
    encrypted_data: encryptedPQ,
  };

  // call req_DH_params
  client.plainCall('req_DH_params', dhParams, ctx, (errd, resDH) => {
    if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');
    if (!ctx.aesKey) throw new Error('Auth: Missing aes_key');
    if (!ctx.aesIv) throw new Error('Auth: Missing aes_iv');

    if (errd || !resDH || resDH._ !== 'server_DH_params_ok') {
      log(ctx.dc, ctx.thread, 'Unexpected req_DH_params response');
      cb(errd);
      return;
    }

    // decrypt encrypted_answer
    const wrapper = resDH;
    const decryptedDH = decrypt(hex(wrapper.encrypted_answer), ctx.aesKey, ctx.aesIv);
    const serverDH = client.tl.parse(decryptedDH.slice(20));

    if (!(serverDH instanceof TLConstructor) || serverDH._ !== 'server_DH_inner_data') {
      log(ctx.dc, ctx.thread, 'Unable to decrypt aes-256-ige');
      cb({
        type: 'internal',
        code: 0,
        message: 'Unable to decrypt aes-256-ige',
      });
      return;
    }

    cb(null, serverDH.json());
  });
}

/**
 * @mtproto set_client_DH_params
 */
function authSetClientDHParams(client: Client, ctx: AuthContext, cb: (_err: ClientError | null, authKey?: AuthKey) => void) {
  // check context
  if (!ctx.g) throw new Error('Auth: Missing g param');
  if (!ctx.ga || ctx.ga.length === 0) throw new Error('Auth: Missing g_a param');
  if (!ctx.dh || ctx.dh.length === 0) throw new Error('Auth: Missing dh_prime param');
  if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');
  if (!ctx.aesKey) throw new Error('Auth: Missing aes_key');
  if (!ctx.aesIv) throw new Error('Auth: Missing aes_iv');

  // generate key;
  const g = BigInt(ctx.g);
  const ga = BigInt(ctx.ga, 16);
  const dhPrime = BigInt(ctx.dh, 16);
  const b = BigInt(new Bytes(255).randomize().hex, 16);
  const gb = g.modPow(b, dhPrime).toString(16);
  const key = ga.modPow(b, dhPrime).toString(16);

  // inner content for client_DH_inner_data
  const clientDH = client.tl.create('client_DH_inner_data', {
    nonce: ctx.nonce.uint,
    server_nonce: ctx.serverNonce.uint,
    retry_id: 0,
    g_b: gb,
  }).serialize();

  let len = 20 + clientDH.length;
  len += 16 - (len % 16);

  const plain = new Bytes(len);
  plain.slice(0, 20).raw = sha1(clientDH.raw);
  plain.slice(20, 20 + clientDH.length).raw = clientDH.raw;
  plain.slice(20 + clientDH.length).randomize();

  // encrypt client_DH_inner_data
  const encryptedDH = encrypt(plain, ctx.aesKey, ctx.aesIv);

  // params for set_client_DH_params
  const clientDHParams = {
    nonce: ctx.nonce.uint,
    server_nonce: ctx.serverNonce.uint,
    encrypted_data: encryptedDH.hex,
  };

  client.plainCall('set_client_DH_params', clientDHParams, ctx, (err, sDH) => {
    if (err || !sDH || sDH._ !== 'dh_gen_ok') {
      log(ctx.dc, ctx.thread, 'Unexpected set_client_DH_params response');
      cb(err);
      return;
    }

    cb(null, {
      id: raw2hex(sha1(hex2raw(key)).slice(12, 20)),
      key,
    });
  });
}

/**
 * Creates AuthKey using DH-exchange
 * Ref: https://core.telegram.org/mtproto/auth_key
 */
export function createAuthKey(client: Client, dc: number, thread: number, expiresAfter: number, cb?: (err: ClientError | null, key?: AuthKey) => void) {
  const ctx: AuthContext = {
    dc,
    thread,
    transport: 'websocket',
    expiresAfter,
    nonce: new Bytes(16).randomize(),
    newNonce: new Bytes(32).randomize(),
  };

  log(dc, `creating ${expiresAfter > 0 ? 'temporary' : 'permanent'} key (${ctx.transport}, thread: ${ctx.thread})`);

  // call req_pq_multi
  authReqPQ(client, ctx, (err, resPQ) => {
    if (err || !resPQ) {
      if (cb) cb(err);
      return;
    }

    ctx.serverNonce = new Bytes(16);
    ctx.serverNonce.uint = resPQ.server_nonce;
    ctx.fingerprints = resPQ.server_public_key_fingerprints;
    ctx.pq = resPQ.pq;
    ctx.aesKey = new Bytes(32);

    ctx.aesKey.slice(0, 20).raw = sha1(ctx.newNonce.raw + ctx.serverNonce.raw);
    ctx.aesKey.slice(20, 32).raw = sha1(ctx.serverNonce.raw + ctx.newNonce.raw).slice(0, 12);

    ctx.aesIv = new Bytes(32);
    ctx.aesIv.slice(0, 8).raw = sha1(ctx.serverNonce.raw + ctx.newNonce.raw).slice(12, 20);
    ctx.aesIv.slice(8, 28).raw = sha1(ctx.newNonce.raw + ctx.newNonce.raw);
    ctx.aesIv.slice(28, 32).raw = ctx.newNonce.slice(0, 4).raw;

    // call req_DH_params
    authReqDHParams(client, ctx, (rerr, serverDH) => {
      if (rerr) {
        if (cb) cb(rerr);
        return;
      }

      // todo: server time sync
      // todo: check dh prime, ga, gb
      ctx.g = serverDH.g;
      ctx.ga = serverDH.g_a;
      ctx.dh = serverDH.dh_prime;

      authSetClientDHParams(client, ctx, (cerr, authKey) => {
        if (!ctx.serverNonce) throw new Error('Auth: Missing server_nonce param');

        if (cerr || !authKey) {
          if (cb) cb(cerr);
          return;
        }

        if (expiresAfter > 0) {
          authKey.expires = Math.floor(Date.now() / 1000) + expiresAfter;
          authKey.binded = false;

          client.dc.setMeta(dc, 'salt', Bytes.xor(ctx.newNonce.slice(0, 8), ctx.serverNonce.slice(0, 8)).hex);
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
export function bindTempAuthKey(client: Client, dc: number, permKey: AuthKey, tempKey: AuthKey, cb?: (result: boolean) => void) {
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

  const bindMsg = new MessageV1(q);

  bindMsg.salt = new Bytes(8).randomize().hex;
  bindMsg.sessionID = new Bytes(8).randomize().hex;
  bindMsg.id = msgID;

  const encryptedMsg = bindMsg.encrypt(permKey.key);

  const query = client.tl.create('auth.bindTempAuthKey', {
    perm_auth_key_id: permAuthKeyID,
    nonce,
    expires_at: expiresAt,
    encrypted_message: encryptedMsg.buf.hex,
  });

  client.call(query, { msgID, dc, force: true }, (err, res) => {
    if (!err && res === true) {
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
export function transferAuthorization(client: Client, userID: number, dcFrom: number, dcTo: number, cb?: (res: boolean) => void) {
  client.call('auth.exportAuthorization', { dc_id: dcTo }, { dc: dcFrom, force: true }, (err, res) => {
    if (err || !res || res._ !== 'auth.exportedAuthorization') {
      if (cb) cb(false);
      return;
    }

    const bytes = res.bytes.value;

    client.call('auth.importAuthorization', { id: userID, bytes }, { dc: dcTo, force: true }, (err2, res2) => {
      if (err2 || !(res2 instanceof TLConstructor) || res2._ !== 'auth.authorization') {
        if (cb) cb(false);
        return;
      }

      if (cb) cb(true);
    });
  });
}
