/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
// @flow

import BigInt from 'big-integer';
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

  return gcd.greater(q) ? [gcd.toString(16), q.toString(16)] : [q.toString(16), gcd.toString(16)];
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

  console.log(x, n, e);
  console.log(x.modPow(e, n));
  return x.modPow(e, n).toString(16);
}
