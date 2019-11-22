import { Bytes } from '../../serialization';
import { strToInt32, int32ToStr } from './utils';

/**
 * Rewritten from forge sha512
 * https://github.com/digitalbazaar/forge/blob/master/lib/sha512.js
 */

// K table for SHA-512
const _k = [
  [0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd],
  [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc],
  [0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019],
  [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118],
  [0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe],
  [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2],
  [0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1],
  [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694],
  [0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3],
  [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65],
  [0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483],
  [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5],
  [0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210],
  [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4],
  [0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725],
  [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70],
  [0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926],
  [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df],
  [0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8],
  [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b],
  [0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001],
  [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30],
  [0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910],
  [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8],
  [0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53],
  [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8],
  [0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb],
  [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3],
  [0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60],
  [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec],
  [0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9],
  [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b],
  [0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207],
  [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178],
  [0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6],
  [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b],
  [0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493],
  [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c],
  [0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a],
  [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817],
];

// padding
let _padding = String.fromCharCode(128);
for (let i = 0; i < 128; i += 1) _padding += String.fromCharCode(0);

/**
 * Updates a SHA-512 state with the given byte buffer.
 * @param s the SHA-512 state to update.
 * @param bytes the byte buffer to update with.
 */
function update(state: number[][], data: string) {
  const nextState = new Array(state.length);

  for (let i = 0; i < nextState.length; i += 1) {
    nextState[i] = state[i].slice(0);
  }

  for (let p = 0; p < data.length - (data.length % 128); p += 128) {
    // Array to use to store words.
    const words = new Array(80);
    for (let wi = 0; wi < 80; wi += 1) words[wi] = new Array(2);

    let i = 0; let hi; let lo; let t1hi; let t1lo; let t2hi; let t2lo;

    // the w array will be populated with sixteen 64-bit big-endian words
    // and then extended into 64 64-bit words according to SHA-512
    for (; i < 16; i += 1) {
      words[i][0] = strToInt32(data, p + i * 8) >>> 0;
      words[i][1] = strToInt32(data, p + i * 8 + 4) >>> 0;
    }

    for (; i < 80; i += 1) {
      // for word 2 words ago: ROTR 19(x) ^ ROTR 61(x) ^ SHR 6(x)
      [hi, lo] = words[i - 2];

      // high bits
      t1hi = (
        ((hi >>> 19) | (lo << 13)) // ROTR 19
        ^ ((lo >>> 29) | (hi << 3)) // ROTR 61/(swap + ROTR 29)
        ^ (hi >>> 6)) >>> 0; // SHR 6

      // low bits
      t1lo = (
        ((hi << 13) | (lo >>> 19)) // ROTR 19
        ^ ((lo << 3) | (hi >>> 29)) // ROTR 61/(swap + ROTR 29)
        ^ ((hi << 26) | (lo >>> 6))) >>> 0; // SHR 6

      // for word 15 words ago: ROTR 1(x) ^ ROTR 8(x) ^ SHR 7(x)
      [hi, lo] = words[i - 15];

      // high bits
      t2hi = (
        ((hi >>> 1) | (lo << 31)) // ROTR 1
        ^ ((hi >>> 8) | (lo << 24)) // ROTR 8
        ^ (hi >>> 7)) >>> 0; // SHR 7

      // low bits
      t2lo = (
        ((hi << 31) | (lo >>> 1)) // ROTR 1
        ^ ((hi << 24) | (lo >>> 8)) // ROTR 8
        ^ ((hi << 25) | (lo >>> 7))) >>> 0; // SHR 7

      // sum(t1, word 7 ago, t2, word 16 ago) modulo 2^64 (carry lo overflow)
      const w7 = words[i - 7];
      const w16 = words[i - 16];

      lo = (t1lo + w7[1] + t2lo + w16[1]);
      words[i][0] = (t1hi + w7[0] + t2hi + w16[0] + ((lo / 0x100000000) >>> 0)) >>> 0;
      words[i][1] = lo >>> 0;
    }

    // initialize hash value for this chunk
    let [ahi, alo] = nextState[0];
    let [bhi, blo] = nextState[1];
    let [chi, clo] = nextState[2];
    let [dhi, dlo] = nextState[3];
    let [ehi, elo] = nextState[4];
    let [fhi, flo] = nextState[5];
    let [ghi, glo] = nextState[6];
    let [hhi, hlo] = nextState[7];

    // round function
    for (i = 0; i < 80; i += 1) {
      // Sum1(e) = ROTR 14(e) ^ ROTR 18(e) ^ ROTR 41(e)
      const s1hi = (
        ((ehi >>> 14) | (elo << 18)) // ROTR 14
        ^ ((ehi >>> 18) | (elo << 14)) // ROTR 18
        ^ ((elo >>> 9) | (ehi << 23))) >>> 0; // ROTR 41/(swap + ROTR 9)

      const s1lo = (
        ((ehi << 18) | (elo >>> 14)) // ROTR 14
        ^ ((ehi << 14) | (elo >>> 18)) // ROTR 18
        ^ ((elo << 23) | (ehi >>> 9))) >>> 0; // ROTR 41/(swap + ROTR 9)

      // Ch(e, f, g) (optimized the same way as SHA-1)
      const chhi = (ghi ^ (ehi & (fhi ^ ghi))) >>> 0;
      const chlo = (glo ^ (elo & (flo ^ glo))) >>> 0;

      // Sum0(a) = ROTR 28(a) ^ ROTR 34(a) ^ ROTR 39(a)
      const s0hi = (
        ((ahi >>> 28) | (alo << 4)) // ROTR 28
        ^ ((alo >>> 2) | (ahi << 30)) // ROTR 34/(swap + ROTR 2)
        ^ ((alo >>> 7) | (ahi << 25))) >>> 0; // ROTR 39/(swap + ROTR 7)

      const s0lo = (
        ((ahi << 4) | (alo >>> 28)) // ROTR 28
        ^ ((alo << 30) | (ahi >>> 2)) // ROTR 34/(swap + ROTR 2)
        ^ ((alo << 25) | (ahi >>> 7))) >>> 0; // ROTR 39/(swap + ROTR 7)

      // Maj(a, b, c) (optimized the same way as SHA-1)
      const majhi = ((ahi & bhi) | (chi & (ahi ^ bhi))) >>> 0;
      const majlo = ((alo & blo) | (clo & (alo ^ blo))) >>> 0;

      // main algorithm
      // t1 = (h + s1 + ch + _k[i] + _w[i]) modulo 2^64 (carry lo overflow)
      lo = (hlo + s1lo + chlo + _k[i][1] + words[i][1]);
      t1hi = (hhi + s1hi + chhi + _k[i][0] + words[i][0] + ((lo / 0x100000000) >>> 0)) >>> 0;
      t1lo = lo >>> 0;

      // t2 = s0 + maj modulo 2^64 (carry lo overflow)
      lo = s0lo + majlo;
      t2hi = (s0hi + majhi + ((lo / 0x100000000) >>> 0)) >>> 0;
      t2lo = lo >>> 0;

      hhi = ghi;
      hlo = glo;

      ghi = fhi;
      glo = flo;

      fhi = ehi;
      flo = elo;

      // e = (d + t1) modulo 2^64 (carry lo overflow)
      lo = dlo + t1lo;
      ehi = (dhi + t1hi + ((lo / 0x100000000) >>> 0)) >>> 0;
      elo = lo >>> 0;

      dhi = chi;
      dlo = clo;

      chi = bhi;
      clo = blo;

      bhi = ahi;
      blo = alo;

      // a = (t1 + t2) modulo 2^64 (carry lo overflow)
      lo = t1lo + t2lo;
      ahi = (t1hi + t2hi + ((lo / 0x100000000) >>> 0)) >>> 0;
      alo = lo >>> 0;
    }

    // update hash state (additional modulo 2^64)
    lo = nextState[0][1] + alo;
    nextState[0][0] = (nextState[0][0] + ahi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[0][1] = lo >>> 0;

    lo = nextState[1][1] + blo;
    nextState[1][0] = (nextState[1][0] + bhi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[1][1] = lo >>> 0;

    lo = nextState[2][1] + clo;
    nextState[2][0] = (nextState[2][0] + chi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[2][1] = lo >>> 0;

    lo = nextState[3][1] + dlo;
    nextState[3][0] = (nextState[3][0] + dhi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[3][1] = lo >>> 0;

    lo = nextState[4][1] + elo;
    nextState[4][0] = (nextState[4][0] + ehi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[4][1] = lo >>> 0;

    lo = nextState[5][1] + flo;
    nextState[5][0] = (nextState[5][0] + fhi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[5][1] = lo >>> 0;

    lo = nextState[6][1] + glo;
    nextState[6][0] = (nextState[6][0] + ghi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[6][1] = lo >>> 0;

    lo = nextState[7][1] + hlo;
    nextState[7][0] = (nextState[7][0] + hhi + ((lo / 0x100000000) >>> 0)) >>> 0;
    nextState[7][1] = lo >>> 0;
  }

  return nextState;
}

/**
 * Calculates sha512 hash from string
 */
export default function sha512(message: string): Bytes {
  // SHA-512 state contains eight 32-bit integers
  let state = [
    [0x6a09e667, 0xf3bcc908],
    [0xbb67ae85, 0x84caa73b],
    [0x3c6ef372, 0xfe94f82b],
    [0xa54ff53a, 0x5f1d36f1],
    [0x510e527f, 0xade682d1],
    [0x9b05688c, 0x2b3e6c1f],
    [0x1f83d9ab, 0xfb41bd6b],
    [0x5be0cd19, 0x137e2179],
  ];

  // 56-bit length of message so far (does not including padding)
  const len = message.length;

  // true 64-bit message length as two 32-bit ints
  const len64 = [(len / 0x100000000) >>> 0, len >>> 0];

  // full message length 128 bit
  const flen = [0, 0, 0, 0];

  for (let i = flen.length - 1; i >= 0; i -= 1) {
    flen[i] += len64[1];
    len64[1] = len64[0] + ((flen[i] / 0x100000000) >>> 0);
    flen[i] >>>= 0;
    len64[0] = ((len64[1] / 0x100000000) >>> 0);
  }

  let pad = message;

  // compute remaining size to be digested (include message length size)
  const remaining = flen[flen.length - 1] + 16;

  // add padding for overflow blockSize - overflow
  // _padding starts with 1 byte with first bit is set (byte value 128), then
  // there may be up to (blockSize - 1) other pad bytes
  const overflow = remaining & (128 - 1);

  pad += _padding.substr(0, 128 - overflow);

  // serialize message length in bits in big-endian order; since length
  // is stored in bytes we multiply by 8 and add carry from next int
  let next; let carry;
  let bits = flen[0] * 8;
  for (let i = 0; i < flen.length - 1; i += 1) {
    next = flen[i + 1] * 8;
    carry = (next / 0x100000000) >>> 0;
    bits += carry;
    pad += int32ToStr(bits >>> 0);
    bits = next >>> 0;
  }

  pad += int32ToStr(bits);

  state = update(state, pad);

  let raw = '';

  for (let i = 0; i < state.length; i += 1) {
    raw += int32ToStr(state[i][0]) + int32ToStr(state[i][1]);
  }

  const buf = new Bytes(64);
  buf.raw = raw;
  return buf;
}