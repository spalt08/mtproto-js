/**
 * Rewritten from forge sha256
 */

/** Gets a uint32 from string in big-endian order order */
function strToUint32(str: string, pos: number) {
  return (
    str.charCodeAt(pos) << 24
    ^ str.charCodeAt(pos + 1) << 16
    ^ str.charCodeAt(pos + 2) << 8
    ^ str.charCodeAt(pos + 3)
  );
}

/** Returns a uint32 as a string in big-endian order order */
function uint32ToStr(data: number) {
  return (
    String.fromCharCode((data >> 24) & 0xFF)
    + String.fromCharCode((data >> 16) & 0xFF)
    + String.fromCharCode((data >> 8) & 0xFF)
    + String.fromCharCode(data & 0xFF)
  );
}

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

  // Array to use to store words.
  const words = new Array(64);

  let len = data.length;
  let p = 0;

  while (len >= 64) {
    let i = 0;
    // the w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 64 32-bit words according to SHA-256
    for (; i < 16; i += 1) {
      words[i] = strToUint32(data, p + i * 4);
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
    let a = state[0];
    let b = state[1];
    let c = state[2];
    let d = state[3];
    let e = state[4];
    let f = state[5];
    let g = state[6];
    let h = state[7];

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
    nextState[0] = (state[0] + a) | 0;
    nextState[1] = (state[1] + b) | 0;
    nextState[2] = (state[2] + c) | 0;
    nextState[3] = (state[3] + d) | 0;
    nextState[4] = (state[4] + e) | 0;
    nextState[5] = (state[5] + f) | 0;
    nextState[6] = (state[6] + g) | 0;
    nextState[7] = (state[7] + h) | 0;

    p += 64;
    len -= 64;
  }

  return nextState;
}

/**
 * Calculates sha256 hash from string
 */
export default function sha256(message: string): string {
  /* This is an optimization for V8-based browsers. When V8 concatenates
  a string, the strings are only joined logically using a "cons string" or
  "constructed/concatenated string". These containers keep references to one
  another and can result in very large memory usage. For example, if a 2MB
  string is constructed by concatenating 4 bytes together at a time, the
  memory usage will be ~44MB; so ~22x increase. The strings are only joined
  together when an operation requiring their joining takes place, such as
  substr(). This function is called when adding data to this buffer to ensure
  these types of strings are periodically joined to reduce the memory
  footprint */
  if (message.length > 4096) message.substr(0, 1);

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

  state = update(state, message);

  const pad = message
    + _padding.substr(0, 64 - ((len64[1] + 8) & 0x3F))
    + uint32ToStr((len64[0] << 3) | (len64[0] >>> 28))
    + uint32ToStr(len64[1] << 3);

  state = update(state, pad);

  return (
    uint32ToStr(state[0])
    + uint32ToStr(state[1])
    + uint32ToStr(state[2])
    + uint32ToStr(state[3])
    + uint32ToStr(state[4])
    + uint32ToStr(state[5])
    + uint32ToStr(state[6])
    + uint32ToStr(state[7])
  );
}
