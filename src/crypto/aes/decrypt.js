// @flow

import aesjs from 'aes-js';
import { Hex } from '../../serialization';

// Default options for encryption
const defaultOptions = {
  blockSize: 16,
};

/**
 * Decrypts cipher text with AES-256-IGE mode.
 *
 * @param {Hex} text Ciphper Text
 * @param {Hex} key AES Key
 * @param {Hex} iv AES Init vector
 * @returns {Hex} Plain Text
 */
export default function decrypt(text: Hex, key: Hex, iv: Hex, options? = defaultOptions): Hex {
  const cipher = new aesjs.AES(new Uint8Array(key.toBuffer()));

  let prevX = iv.sliceBytes(0, options.blockSize);
  let prevY = iv.sliceBytes(options.blockSize, iv.byteLength);
  let plainText = '';

  for (let i = 0; i < text.byteLength; i += options.blockSize) {
    const x = text.sliceBytes(i, i + options.blockSize);
    const yXOR = Hex.xor(x, prevY);

    const bytesY = cipher.decrypt(new Uint8Array(yXOR.toBuffer()));
    const cipheredY = Hex.fromCharCode(...bytesY);
    const y = Hex.xor(cipheredY, prevX);

    prevX = x;
    prevY = y;
    plainText += y.toString();
  }

  return new Hex(plainText);
}
