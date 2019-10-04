// @flow

import sha1 from 'rusha';
import * as asn1js from 'asn1js';
import { logs } from './utils/log';
import { pqPrimePollard, randomBytes, rsa } from './works';
import { TLMessage } from './tl/serialization';

export default async function Authorize(transport, tl): string {
  const reqPq = tl.query('req_pq').randomize('nonce'); // req_pq_multi#be7e8ef1 nonce:int128 = ResPQ

  logs('auth', 'prepared req_pq \n', reqPq.message.dump());

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

  console.log(pwrapper, qwrapper);

  pqInnerData.setHexString('pq', pqwrapper, true);
  pqInnerData.setHexString('p', pwrapper, true);
  pqInnerData.setHexString('q', qwrapper, true);
  pqInnerData.set('nonce', nonce);
  pqInnerData.set('server_nonce', serverNonce);
  pqInnerData.randomize('new_nonce');

  logs('auth', 'p_q_innerData \n', pqInnerData.message.dump());

  const pqhash = sha1.createHash().update(pqInnerData.message).digest('hex');

  logs('auth', 'hash', pqhash);

  const dataWithHash = pqhash + pqInnerData.toString() + randomBytes(255 - pqhash.length / 2 - pqInnerData.message.buf.byteLength);
  const pkfingerprint = serverPublicKeys[0].getHexString();

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

  console.log('rsa', encryptedData.length, encryptedData);

  // rsa(sha1(pqInnerData.toString()), serverPublicKey);


}
