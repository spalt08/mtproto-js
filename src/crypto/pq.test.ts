import BigInt from 'big-integer';
import { pqPrimePollard, BrentPrime } from './pq';

test('calc | pq', () => {
  const pq = BigInt('17ED48941A08F981', 16);

  expect(pqPrimePollard(pq)).toEqual([BigInt('494C553B', 16), BigInt('53911073', 16)]);
  expect(BrentPrime(pq)).toEqual([BigInt('494C553B', 16), BigInt('53911073', 16)]);
});
