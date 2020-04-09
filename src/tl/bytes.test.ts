/* eslint-disable max-len */
import TLBytes from './bytes';
import { Reader32, Writer32 } from '../serialization';

test('TLBytes | read', () => {
  const tl = new TLBytes('string');

  tl.read(
    new Reader32(
      new Uint32Array([
        0x0c546573, 0x74206361, 0x73652023, 0x31000000,
      ]),
    ),
  );

  expect(tl.value).toEqual('Test case #1');

  tl.read(
    new Reader32(
      new Uint32Array([
        0x0cd09cd0, 0xb0d0bad1, 0x81d0b8d0, 0xbc000000,
      ]),
    ),
  );

  expect(tl.value).toEqual('Максим');
});


test('TLBytes | write', () => {
  const empty = new Writer32(new Uint32Array(4));

  const tl = new TLBytes('string', 'Test case #1');
  tl.write(empty);

  expect(empty.buf).toEqual(
    new Uint32Array([
      0x0c546573, 0x74206361, 0x73652023, 0x31000000,
    ]),
  );
});
