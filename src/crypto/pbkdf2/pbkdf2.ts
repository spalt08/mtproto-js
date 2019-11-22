import sha512 from '../hash/sha512';
import hmac from './hmac';
import { int32ToStr, xorStr } from '../hash/utils';
import { Bytes } from '../../serialization';

export default function pbkdf2(
  pwd: string,
  salt: string,
  iter: number,
  dklen: number = 64,
  hlen: number = 64,
  blen: number = 128,
  digest: Function = sha512,
) {
  /* 1. If dkLen > (2^32 - 1) * hLen, output "derived key too long" and stop. */
  if (dklen > (0xFFFFFFFF * hlen)) {
    throw new Error('Derived key is too long.');
  }

  /* 2. Let len be the number of hLen-octet blocks in the derived key,
    rounding up, and let r be the number of octets in the last
    block:
    len = CEIL(dkLen / hLen),
    r = dkLen - (len - 1) * hLen. */
  const len = Math.ceil(dklen / hlen);
  const r = dklen - (len - 1) * hlen;

  /* 3. For each block of the derived key apply the function F defined
    below to the password P, the salt S, the iteration count c, and
    the block index to compute the block:
    T_1 = F(P, S, c, 1),
    T_2 = F(P, S, c, 2),
    ...
    T_len = F(P, S, c, len),
    where the function F is defined as the exclusive-or sum of the
    first c iterates of the underlying pseudorandom function PRF
    applied to the password P and the concatenation of the salt S
    and the block index i:
    F(P, S, c, i) = u_1 XOR u_2 XOR ... XOR u_c
    where
    u_1 = PRF(P, S || INT(i)),
    u_2 = PRF(P, u_1),
    ...
    u_c = PRF(P, u_{c-1}).
    Here, INT(i) is a four-octet encoding of the integer i, most
    significant octet first. */
  let dk = '';
  let xor; let uc; let uc1;

  for (let i = 1; i <= len; i += 1) {
    // PRF(P, S || INT(i)) (first iteration)
    xor = uc1 = hmac(salt + int32ToStr(i), pwd, blen, digest).raw; // eslint-disable-line no-multi-assign

    // PRF(P, u_{c-1}) (other iterations)
    for (let j = 2; j <= iter; j += 1) {
      uc = hmac(uc1, pwd, blen, digest).raw;
      // F(p, s, c, i)
      xor = xorStr(xor, uc, hlen);
      uc1 = uc;
    }

    /* 4. Concatenate the blocks and extract the first dkLen octets to
      produce a derived key DK:
      DK = T_1 || T_2 ||  ...  || T_len<0..r-1> */
    dk += (i < len) ? xor : xor.substr(0, r);
  }

  /* 5. Output the derived key DK. */
  const buf = new Bytes(dk.length);
  buf.raw = dk;
  return buf;
}
