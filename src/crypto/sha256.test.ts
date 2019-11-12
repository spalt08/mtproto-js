import sha256 from './sha256';
import { hex } from '../serialization';

test('hash | sha256', () => {
  const buf = hex('48656c6c6f20776f726c6421');

  expect(sha256(buf.raw).hex).toEqual('c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a');
});
