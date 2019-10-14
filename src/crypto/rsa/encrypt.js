// @flow

import BigInt from 'big-integer';

/**
 * Encrypts hex string with RSA
 * @param {string} data Data to encrypt, hex-string
 * @param {string} modulus RSA Key Modulus, hex-string
 * @param {string} exponent RSA Key Exponent, hex-string
 * @returns {string} Encrypted data, hex-string
 */
export default function encrypt(data: string, modulus?: string, exponent?: string): string {
  const x = BigInt(data, 16);
  const n = BigInt(modulus, 16);
  const e = BigInt(exponent, 16);

  return x.modPow(e, n).toString(16);
}
