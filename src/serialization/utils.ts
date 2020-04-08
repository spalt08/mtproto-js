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
