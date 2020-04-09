import BigInt from 'big-integer';
import sha256 from '@cryptography/sha256';
import pbkdf2 from '@cryptography/pbkdf2';
import sha512 from '@cryptography/sha512';
import { hex, Bytes } from '../serialization';

function phex(size: number, value: string): Bytes {
  let str = '';
  for (let i = 0; i < size - value.length / 2; i += 1) {
    str += '00';
  }

  return hex((str + value).slice(-size * 2));
}

export function genPasswordSRP(
  salt1: string, salt2: string, cg: number, cp: string, srpId: string, csrpB: string, password: string, rand?: string,
): any {
  const clientSalt = hex(salt1);
  const serverSalt = hex(salt2);
  const g = BigInt(cg);
  const p = BigInt(cp, 16);

  const gBuf = phex(256, g.toString(16));
  const pBuf = phex(256, cp);

  const srpB = BigInt(csrpB, 16);
  const srpBBuf = phex(256, csrpB);

  let pwdhash;
  pwdhash = sha256(clientSalt.raw + password + clientSalt.raw);
  pwdhash = sha256(serverSalt.raw + pwdhash + serverSalt.raw);
  pwdhash = pbkdf2(pwdhash as any, clientSalt.raw, 100000, 64, sha512);
  pwdhash = new Bytes(sha256(serverSalt.raw + pwdhash + serverSalt.raw));

  const x = BigInt(pwdhash.hex, 16);
  const gx = g.modPow(x, p);

  const k = BigInt(new Bytes(sha256(pBuf.raw + gBuf.raw)).hex, 16);
  const kgx = k.multiply(gx).mod(p);

  const aBuf = rand ? hex(rand) : new Bytes(256).randomize();
  const a = BigInt(aBuf.hex, 16);
  const Ac = g.modPow(a, p);
  const AcBuf = phex(256, Ac.toString(16));

  let bkgx = srpB.subtract(kgx);
  if (bkgx.lesser(BigInt.zero)) bkgx = bkgx.add(p);

  const u = BigInt(new Bytes(sha256(AcBuf.raw + srpBBuf.raw)).hex, 16);
  const ux = u.multiply(x);
  const uxa = ux.add(a);

  const S = bkgx.modPow(uxa, p);
  const SBuf = phex(256, S.toString(16));

  const K = sha256(SBuf.raw);
  const h1 = sha256(pBuf.raw);
  const h2 = sha256(gBuf.raw);
  const h12 = Bytes.xor(new Bytes(h1), new Bytes(h2));

  const M1 = sha256(h12.raw + sha256(clientSalt.raw) + sha256(serverSalt.raw) + AcBuf.raw + srpBBuf.raw + K);

  return {
    _: 'inputCheckPasswordSRP',
    srp_id: srpId,
    A: AcBuf.raw,
    M1: new Bytes(M1).raw,
  };
}
