import BigInt from 'big-integer';
import uint from './uint';

test('uint | conversion', () => {
  expect(uint('178639297fdc75d')).toEqual(BigInt('105944072509572957'));
});
