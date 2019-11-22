import { Bytes } from '../../serialization';
import { strToInt32, int32ToStr } from './utils';

/**
 * Rewritten from forge sha256
 * https://github.com/digitalbazaar/forge/blob/master/lib/sha256.js
 */

// K table for SHA-256
const _k = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

// padding
let _padding = String.fromCharCode(128);
for (let i = 0; i < 64; i += 1) _padding += String.fromCharCode(0);

/**
 * Updates a SHA-256 state with the given byte buffer.
 * @param s the SHA-256 state to update.
 * @param bytes the byte buffer to update with.
 */
function update(state: number[], data: string) {
  let t1; let t2; let s0; let s1; let ch; let maj;

  const nextState = state.slice(0, 8);

  for (let p = 0; p < data.length - (data.length % 64); p += 64) {
    // Array to use to store words.
    const words = new Array(64);

    let i = 0;
    // the w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 64 32-bit words according to SHA-256
    for (; i < 16; i += 1) {
      words[i] = strToInt32(data, p + i * 4);
    }

    for (; i < 64; i += 1) {
      // XOR word 2 words ago rot right 17, rot right 19, shft right 10
      t1 = words[i - 2];
      t1 = ((t1 >>> 17) | (t1 << 15))
        ^ ((t1 >>> 19) | (t1 << 13))
        ^ (t1 >>> 10);

      // XOR word 15 words ago rot right 7, rot right 18, shft right 3
      t2 = words[i - 15];
      t2 = ((t2 >>> 7) | (t2 << 25))
        ^ ((t2 >>> 18) | (t2 << 14))
        ^ (t2 >>> 3);

      // sum(t1, word 7 ago, t2, word 16 ago) modulo 2^32
      words[i] = (t1 + words[i - 7] + t2 + words[i - 16]) | 0;
    }

    // initialize hash value for this chunk
    let a = nextState[0];
    let b = nextState[1];
    let c = nextState[2];
    let d = nextState[3];
    let e = nextState[4];
    let f = nextState[5];
    let g = nextState[6];
    let h = nextState[7];

    // round function
    for (i = 0; i < 64; i += 1) {
      // Sum1(e)
      s1 = ((e >>> 6) | (e << 26))
        ^ ((e >>> 11) | (e << 21))
        ^ ((e >>> 25) | (e << 7));

      // Ch(e, f, g) (optimized the same way as SHA-1)
      ch = g ^ (e & (f ^ g));

      // Sum0(a)
      s0 = ((a >>> 2) | (a << 30))
        ^ ((a >>> 13) | (a << 19))
        ^ ((a >>> 22) | (a << 10));

      // Maj(a, b, c) (optimized the same way as SHA-1)
      maj = (a & b) | (c & (a ^ b));

      // main algorithm
      t1 = h + s1 + ch + _k[i] + words[i];
      t2 = s0 + maj;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    // update hash state
    nextState[0] = (nextState[0] + a) | 0;
    nextState[1] = (nextState[1] + b) | 0;
    nextState[2] = (nextState[2] + c) | 0;
    nextState[3] = (nextState[3] + d) | 0;
    nextState[4] = (nextState[4] + e) | 0;
    nextState[5] = (nextState[5] + f) | 0;
    nextState[6] = (nextState[6] + g) | 0;
    nextState[7] = (nextState[7] + h) | 0;
  }

  return nextState;
}

/**
 * Calculates sha256 hash from string
 */
export default function sha256(message: string): Bytes {
  // 56-bit length of message so far (does not including padding)
  const len = message.length;

  // true 64-bit message length as two 32-bit ints
  const len64 = [(len / 0x100000000) >>> 0, len >>> 0];

  // SHA-256 state contains eight 32-bit integers
  let state = [
    0x6A09E667,
    0xBB67AE85,
    0x3C6EF372,
    0xA54FF53A,
    0x510E527F,
    0x9B05688C,
    0x1F83D9AB,
    0x5BE0CD19,
  ];

  const pad = message
    + _padding.substr(0, 64 - ((len64[1] + 8) & 0x3F))
    + int32ToStr((len64[0] << 3) | (len64[0] >>> 28))
    + int32ToStr(len64[1] << 3);

  state = update(state, pad);

  const buf = new Bytes(32);

  buf.raw = int32ToStr(state[0])
    + int32ToStr(state[1])
    + int32ToStr(state[2])
    + int32ToStr(state[3])
    + int32ToStr(state[4])
    + int32ToStr(state[5])
    + int32ToStr(state[6])
    + int32ToStr(state[7]);

  return buf;
}
