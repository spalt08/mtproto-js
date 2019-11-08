import BigInt, { BigInteger } from 'big-integer';

/**
 * Prime factorization p-Pollard Algorithm.
 * o(n^1/4)
 * @param {number} pq
 * @returns {number[]} [p, q], where P > q
 */
export default function pqPrimePollard(pq: number | BigInteger): BigInteger[] {
  const n = BigInt(pq.toString());

  const F = (_x: BigInteger): BigInteger => _x.multiply(_x).subtract(BigInt.one);

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

  return gcd.greater(q) ? [q, gcd] : [gcd, q];
}
