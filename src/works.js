/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
// @flow

import BigInt from 'big-integer';
import { CryptoJS } from '@goodmind/node-cryptojs-aes'
import HexDump from './utils/hexdump';

// p-Pollard Algotitm; o(n^1/4)
export function pqPrimePollard(hex: string): Array<string> {
  const n = BigInt(hex, 16);

  const F = (_x: BigInt): BigInt => _x.multiply(_x).subtract(BigInt.one);

  let x = BigInt.randBetween(1, n);
  let y = BigInt.one;
  let stage = 2;
  let i = 0;

  let gcd = BigInt.gcd(n, (x.subtract(y)).abs());

  while (gcd.equals(BigInt.one)) {
    if (i === stage) {
      y = x;
      stage *= 2;
    }

    x = F(x).mod(n);

    gcd = BigInt.gcd(n, (x.subtract(y)).abs());

    i += 1;
  }

  const q = n.divide(gcd);

  return gcd.greater(q) ? [q.toString(16), gcd.toString(16)] : [gcd.toString(16), q.toString(16)];
}

export function randomBytes(num: number): string {
  let hexStr = '';
  let rnd;

  for (let i = 0; i < num; i += 1) {
    rnd = Math.floor(Math.random() * 255);
    hexStr += `0${rnd.toString(16)}`.slice(-2);
  }

  return hexStr;
}

export function rsa(data: string, modulus: string, exponent: string): string {
  const x = BigInt(data, 16);
  const n = BigInt(modulus, 16);
  const e = BigInt(exponent, 16);

  return x.modPow(e, n).toString(16);
}

export function aes(encrypted: string, iv: string, key: string): string {
  window.cjs = CryptoJS;

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Hex.parse(encrypted) },
    CryptoJS.enc.Hex.parse(key),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.NoPadding,
      mode: CryptoJS.mode.IGE,
    },
  );

  return CryptoJS.enc.Hex.stringify(decrypted);
}

export function aesenc(text: string, iv: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Hex.parse(text),
    CryptoJS.enc.Hex.parse(key), 
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.NoPadding,
      mode: CryptoJS.mode.IGE,
    }
  ).ciphertext;

  return CryptoJS.enc.Hex.stringify(encrypted);
}

export function generateDH(g: number, dhPrime: string): string {
  return BigInt(g).modPow(BigInt.randBetween('-1e256', '1e256'), BigInt(dhPrime, 16)).toString(16);
}
