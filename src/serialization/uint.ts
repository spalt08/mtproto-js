import BigInt, { BigInteger } from 'big-integer';

/**
 * Helper function for creating BigInteger with numbers
 */
export default function uint(str: string): BigInteger {
  return BigInt(str, 16);
}
