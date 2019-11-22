import { Bytes } from '../../serialization';
import { strToInt32, int32ToStr } from './utils';

/**
 * Rewritten from forge sha1
 * https://github.com/digitalbazaar/forge/blob/master/lib/sha1.js
 */

// padding
let _padding = String.fromCharCode(128);
for (let i = 0; i < 64; i += 1) _padding += String.fromCharCode(0);

/**
 * Updates a SHA-1 state with the given byte buffer.
 */
function update(state: number[], data: string) {
  const nextState = state.slice(0, 8);

  // consume 512 bit (64 byte) chunks
  for (let p = 0; p < data.length - (data.length % 64); p += 64) {
    // Array to use to store words.
    const words = new Array(80);

    // initialize hash value for this chunk
    let a = nextState[0];
    let b = nextState[1];
    let c = nextState[2];
    let d = nextState[3];
    let e = nextState[4];

    let i = 0; let f = 0; let t = 0;

    // round 1
    for (; i < 16; i += 1) {
      words[i] = strToInt32(data, p + i * 4);

      f = d ^ (b & (c ^ d));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + words[i];
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    for (; i < 20; i += 1) {
      t = (words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16]);
      t = (t << 1) | (t >>> 31);
      words[i] = t;
      f = d ^ (b & (c ^ d));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    // round 2
    for (; i < 32; i += 1) {
      t = (words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16]);
      t = (t << 1) | (t >>> 31);
      words[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    for (; i < 40; i += 1) {
      t = (words[i - 6] ^ words[i - 16] ^ words[i - 28] ^ words[i - 32]);
      t = (t << 2) | (t >>> 30);
      words[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    // round 3
    for (; i < 60; i += 1) {
      t = (words[i - 6] ^ words[i - 16] ^ words[i - 28] ^ words[i - 32]);
      t = (t << 2) | (t >>> 30);
      words[i] = t;
      f = (b & c) | (d & (b ^ c));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x8F1BBCDC + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    // round 4
    for (; i < 80; i += 1) {
      t = (words[i - 6] ^ words[i - 16] ^ words[i - 28] ^ words[i - 32]);
      t = (t << 2) | (t >>> 30);
      words[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0xCA62C1D6 + t;
      e = d;
      d = c;
      // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = t;
    }

    // update hash state
    nextState[0] = (nextState[0] + a) | 0;
    nextState[1] = (nextState[1] + b) | 0;
    nextState[2] = (nextState[2] + c) | 0;
    nextState[3] = (nextState[3] + d) | 0;
    nextState[4] = (nextState[4] + e) | 0;
  }

  return nextState;
}

/**
 * Calculates sha1 hash from string
 */
export default function sha1(message: string): Bytes {
  // SHA-256 state contains five 32-bit integers
  let state = [
    0x67452301,
    0xEFCDAB89,
    0x98BADCFE,
    0x10325476,
    0xC3D2E1F0,
  ];

  // 56-bit length of message so far (does not including padding)
  const len = message.length;
  const len64 = [(len / 0x100000000) >>> 0, len >>> 0];
  const flen = [0, 0];

  for (let i = flen.length - 1; i >= 0; i -= 1) {
    flen[i] += len64[1];
    len64[1] = len64[0] + ((flen[i] / 0x100000000) >>> 0);
    flen[i] >>>= 0;
    len64[0] = ((len64[1] / 0x100000000) >>> 0);
  }

  let pad = message;

  // compute remaining size to be digested (include message length size)
  const remaining = flen[flen.length - 1] + 8;

  // add padding for overflow blockSize - overflow
  // _padding starts with 1 byte with first bit is set (byte value 128), then
  // there may be up to (blockSize - 1) other pad bytes
  const overflow = remaining & (64 - 1);

  pad += _padding.substr(0, 64 - overflow);

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

  const buf = new Bytes(20);

  buf.raw = int32ToStr(state[0])
    + int32ToStr(state[1])
    + int32ToStr(state[2])
    + int32ToStr(state[3])
    + int32ToStr(state[4]);

  return buf;
}
