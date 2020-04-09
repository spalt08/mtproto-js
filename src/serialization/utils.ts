/* eslint-disable no-restricted-globals */
export function i2h(number: number) {
  return `00000000${number.toString(16)}`.slice(-8);
}

export const utf8decoder = self.TextDecoder ? new TextDecoder() : {
  decode: (buf: ArrayBuffer | SharedArrayBuffer) => {
    const uint = new Uint8Array(buf);
    let str = '';

    for (let i = 0; i < uint.byteLength; i++) str += String.fromCharCode(uint[i]);

    return decodeURIComponent(escape(str));
  },
};

export const utf8encoder = self.TextEncoder ? new TextEncoder() : {
  encode: (src: string) => {
    const str = unescape(encodeURIComponent(src));
    const uint = new Uint8Array(str.length);

    for (let i = 0; i < str.length; i++) uint[i] = str.charCodeAt(i);

    return uint;
  },
};

/**
 * Randomize
 */
export function randomize(buf: Uint32Array | Uint8Array, start: number = 0) {
  if (!start && self.crypto && self.crypto.getRandomValues) {
    self.crypto.getRandomValues(buf);
  } else {
    const base = buf instanceof Uint32Array ? 0xFFFFFFFF : 0xFF;
    for (let i = start; i < buf.length; i += 1) {
      buf[i] = Math.ceil(Math.random() * base);
    }
  }
}

/**
 * Randomize
 */
export function reverse32(buf: Uint32Array) {
  const reversed = new Uint32Array(buf.length);

  for (let i = 0; i < buf.length; i++) {
    reversed[i] = (
      (buf[buf.length - i - 1] & 0xFF) << 24
    ^ ((buf[buf.length - i - 1] >> 8) & 0xFF) << 16
    ^ ((buf[buf.length - i - 1] >> 16) & 0xFF) << 8
    ^ ((buf[buf.length - i - 1] >>> 24) & 0xFF)
    ) >>> 0;
  }

  return reversed;
}
