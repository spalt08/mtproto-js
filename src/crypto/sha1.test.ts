import sha1 from './sha1';
import { hex } from '../serialization';

test('hash | sha1', () => {
  const buf = hex('48656c6c6f20776f726c6421');

  expect(sha1(buf).hex).toEqual('d3486ae9136e7856bc42212385ea797094475802');
});
