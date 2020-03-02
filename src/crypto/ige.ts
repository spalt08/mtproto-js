import aesjs from 'aes-js';
import { Bytes } from '../serialization';

// Default options for encryption
const defaultOptions = {
  blockSize: 16,
};

/**
 * Decrypts cipher text with AES-256-IGE mode.
 */
export function decrypt(text: Bytes | string, key: Bytes, iv: Bytes, options: Record<string, any> = defaultOptions): Bytes {
  const plainText = new Bytes(text.length);
  const cipher = new aesjs.AES(key.buffer);

  let prevX = iv.slice(0, options.blockSize);
  let prevY = iv.slice(options.blockSize, iv.length);

  for (let i = 0; i < text.length; i += options.blockSize) {
    let x = text.slice(i, i + options.blockSize);
    if (!(x instanceof Bytes)) x = new Bytes(x);

    const yXOR = Bytes.xor(x, prevY);

    const bytesY = new Bytes(cipher.decrypt(yXOR.buffer));
    const y = Bytes.xor(bytesY, prevX);

    prevX = x;
    prevY = y;
    plainText.slice(i, i + options.blockSize).raw = y.raw;
  }

  return plainText;
}

/**
 * Encrypts plain text with AES-256-IGE mode.
 */
export function encrypt(text: Bytes, key: Bytes, iv: Bytes, options: Record<string, any> = defaultOptions): Bytes {
  const cipherText = new Bytes(text.length);
  const cipher = new aesjs.AES(key.buffer);

  let prevX = iv.slice(options.blockSize, iv.length);
  let prevY = iv.slice(0, options.blockSize);

  for (let i = 0; i < text.length; i += options.blockSize) {
    const x = text.slice(i, i + options.blockSize);
    const yXOR = Bytes.xor(x, prevY);

    const bytesY = new Bytes(cipher.encrypt(yXOR.buffer));
    const y = Bytes.xor(bytesY, prevX);

    prevX = x;
    prevY = y;

    cipherText.slice(i, i + options.blockSize).raw = y.raw;
  }

  return cipherText;
}
