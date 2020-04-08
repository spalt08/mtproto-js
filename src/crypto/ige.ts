import { IGE } from '@cryptography/aes';
import { Bytes } from '../serialization';

// Default options for encryption
const defaultOptions = {
  blockSize: 16,
};

/**
 * Decrypts cipher text with AES-256-IGE mode.
 */
export function decrypt(text: Bytes | string, key: Bytes, iv: Bytes, _options: Record<string, any> = defaultOptions): Bytes {
  const cipher = new IGE(key.buffer, iv.buffer);
  return new Bytes(cipher.decrypt(typeof text === 'string' ? text : text.buffer));
}

/**
 * Encrypts plain text with AES-256-IGE mode.
 */
export function encrypt(text: Bytes, key: Bytes, iv: Bytes, _options: Record<string, any> = defaultOptions): Bytes {
  const cipher = new IGE(key.buffer, iv.buffer);
  return new Bytes(cipher.encrypt(typeof text === 'string' ? text : text.buffer));
}
