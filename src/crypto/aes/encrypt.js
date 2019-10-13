// @flow

import aesjs from 'aes-js';
import { Hex } from '../../serialization';

// Default options for encryption
const defaultOptions = {
  blockSize: 16,
};

/**
 * Encrypts plain text with AES-256-IGE mode.
 *
 * @param {Hex} text Plain Text
 * @param {Hex} key AES Key
 * @param {Hex} iv AES Init vector
 * @returns {Hex} Cipher Text
 */
export default function encrypt(text: Hex, key: Hex, iv: Hex, options? = defaultOptions): Hex {
  const cipher = new aesjs.AES(new Uint8Array(key.toBuffer()));

  let prevX = iv.sliceBytes(options.blockSize, iv.byteLength);
  let prevY = iv.sliceBytes(0, options.blockSize);
  let chiperText = '';

  for (let i = 0; i < text.byteLength; i += options.blockSize) {
    const x = text.sliceBytes(i, i + options.blockSize);
    const yXOR = Hex.xor(x, prevY);

    const bytesY = cipher.encrypt(new Uint8Array(yXOR.toBuffer()));
    const cipheredY = Hex.fromCharCode(...bytesY);
    const y = Hex.xor(cipheredY, prevX);

    prevX = x;
    prevY = y;
    chiperText += y.toString();
  }

  return new Hex(chiperText);
}
