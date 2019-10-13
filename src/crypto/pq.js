// @flow

import BigInt from 'big-integer';
import { Hex } from '../serialization';

/**
 * Prime factorization p-Pollard Algorithm.
 * o(n^1/4)
 * Ref:
 * @param {Hex} pq
 * @returns {Hex[]} [p, q], where P > q
 */
export default function pqPrimePollard(pq: Hex): Hex[] {
  const n = BigInt(pq.toString(), 16);

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
