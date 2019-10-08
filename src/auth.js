// @flow

import sha1 from 'rusha';
import * as asn1js from 'asn1js';
import { logs } from './utils/log';
import { pqPrimePollard, randomBytes, rsa, aes, aesenc, generateDH, computeAuthKey } from './works';
import { TLMessage } from './tl/serialization';
import HexDump from './utils/hexdump';

export default async function Authorize(transport, tl): string {
  const reqPq = tl.query('req_pq').randomize('nonce'); // req_pq_multi#be7e8ef1 nonce:int128 = ResPQ

  logs('auth', 'prepared req_pq');

  const respq = await transport.call(reqPq);
  logs('auth', 'got respq', respq);

  const nonce = respq.getString('nonce');
  const serverNonce = respq.getString('server_nonce');
  const pqwrapper = respq.getHexString('pq', true);
  const pqlength = parseInt(pqwrapper.slice(0, 2), 16);
  const pq = pqwrapper.slice(2, 2 + pqlength * 2);
  const serverPublicKeys = respq.getArray('server_public_key_fingerprints');

  logs('auth', 'pq', pq);
  const [p, q] = pqPrimePollard(pq);

  logs('auth', 'factorized', p, q);

  const pqInnerData = tl.construct('p_q_inner_data');

  const pstr = p.length % 2 === 1 ? `0${p}` : p;
  const plength = `0${(pstr.length / 2).toString(16)}`.slice(-2);
  const pwrapper = `${plength}${pstr}${'00'.repeat(8 - plength - 1)}`;

  const qstr = q.length % 2 === 1 ? `0${q}` : q;
  const qlength = `0${(qstr.length / 2).toString(16)}`.slice(-2);
  const qwrapper = `${qlength}${qstr}${'00'.repeat(8 - qlength - 1)}`;

  pqInnerData.setHexString('pq', pqwrapper, true);
  pqInnerData.setHexString('p', pwrapper, true);
  pqInnerData.setHexString('q', qwrapper, true);
  pqInnerData.set('nonce', nonce);
  pqInnerData.set('server_nonce', serverNonce);
  pqInnerData.randomize('new_nonce');

  const pqhash = sha1.createHash().update(pqInnerData.message.buf).digest('hex');

  logs('auth', 'hash', pqhash);

  const dataWithHash = pqhash + pqInnerData.toHexString() + randomBytes(255 - pqhash.length / 2 - pqInnerData.message.buf.byteLength);

  const pkfingerprint = serverPublicKeys[0].getHexString(true);

  // key parse
  const pk = atob(`MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB`);

  const ab = new ArrayBuffer(pk.length);
  const view = new DataView(ab);

  for (let i = 0; i < pk.length; i += 1) {
    view.setUint8(i, pk.charCodeAt(i));
  }

  const parsedPK = asn1js.fromBER(ab);

  const modulus = new TLMessage(parsedPK.result.valueBlock.value[0].valueBlock.valueHex);
  const exponent = new TLMessage(parsedPK.result.valueBlock.value[1].valueBlock.valueHex);

  const encryptedData = rsa(dataWithHash, modulus.toHexString(), exponent.toHexString());


  const reqDHParams = tl.query('req_DH_params');

  reqDHParams.set('nonce', nonce);
  reqDHParams.set('server_nonce', serverNonce);
  reqDHParams.setHexString('p', pwrapper, true);
  reqDHParams.setHexString('q', qwrapper, true);
  reqDHParams.setHexString('public_key_fingerprint', pkfingerprint, true);
  reqDHParams.setHexString('encrypted_data', encryptedData, true);

  logs('auth', 'req_DH_params generated');

  const DHres = await transport.call(reqDHParams);
  logs('auth', 'got dh result', DHres);

  const newNonce = pqInnerData.getHexString('new_nonce', true);
  const srvNonce = reqDHParams.getHexString('server_nonce', true);

  if (DHres.declaration.predicate === 'server_dh_params_ok') {
    const tmpAesKey = (
      sha1.createHash().update(
        TLMessage.FromHex(newNonce + srvNonce, true).buf,
      ).digest('hex')
      + sha1.createHash().update(
        TLMessage.FromHex(srvNonce + newNonce, true).buf,
      ).digest('hex').slice(0, 24)
    );

    const tmpAesIv = (
      sha1.createHash().update(
        TLMessage.FromHex(srvNonce + newNonce).buf,
      ).digest('hex').slice(24, 40)
      + sha1.createHash().update(
        TLMessage.FromHex(newNonce + newNonce).buf,
      ).digest('hex')
      + newNonce.slice(0, 8)
    );

    const encAnswer = DHres.getHexString('encrypted_answer', true);

    logs('auth', 'aes_key', tmpAesKey);
    logs('auth', 'aes_iv', tmpAesIv);

    const decryptedAnswer = aes(encAnswer, tmpAesIv, tmpAesKey);
    const answerWithPadding = decryptedAnswer.slice(40);

    const DHinnerData = tl.fromHex(answerWithPadding, true);

    window.did = DHinnerData;

    const g = DHinnerData.getNumber('g');
    const ga = DHinnerData.getHexString('g_a', true);
    const dhPrime = DHinnerData.getHexString('dh_prime', true);

    // TO DO: check dhPrime
    logs('auth', 'dhPrime checking');

    const clientDHData = tl.construct('client_DH_inner_data');
    const [gb, b] = generateDH(g, dhPrime);

    logs('auth', 'gb generated');

    clientDHData.set('nonce', nonce);
    clientDHData.set('server_nonce', serverNonce);
    clientDHData.setHexString('g_b', gb, true);

    const cdhHash = sha1.createHash().update(clientDHData.message.buf).digest('hex');
    const cdWithHash = cdhHash + clientDHData.toHexString() + randomBytes(16 - ((cdhHash.length / 2 + clientDHData.message.buf.byteLength) % 16));

    const encryptedCDH = aesenc(cdWithHash, tmpAesIv, tmpAesKey);

    logs('auth', 'encrypted_data', encryptedCDH.length, encryptedCDH);

    const setDHq = tl.query('set_client_DH_params');

    console.log(setDHq);

    setDHq.set('nonce', nonce);
    setDHq.set('server_nonce', serverNonce);
    setDHq.setHexString('encrypted_data', encryptedCDH, true);

    logs('auth', 'set_client_DH_params generated');

    const dhGenStatus = await transport.call(setDHq);
    logs('auth', 'got dh gen status', dhGenStatus);

    const authKey = computeAuthKey(ga, b, dhPrime);
    const authKeyHash = sha1.createHash().update(TLMessage.FromHex(authKey).buf).digest('hex');
    const authKeyAux = authKeyHash.slice(0, 16);
    const authKeyID = authKeyHash.slice(-16);

    console.log(authKey);
    console.log(authKeyHash);
    console.log(authKeyAux);
    console.log(authKeyID);
  }
  // rsa(sha1(pqInnerData.toString()), serverPublicKey);
}
