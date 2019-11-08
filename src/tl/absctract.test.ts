import TLAbscract from './abstract';
import Bytes from '../serialization/bytes';

test('TLAbsctract | read', () => {
  const data = new Bytes(new Uint8Array([1, 97, 98, 99, 100]));

  const tl = new TLAbscract();
  tl.byteSize = 4;
  tl.read(data, 1);

  expect(tl.value).toBe('abcd');
});

test('TLAbsctract | write', () => {
  const empty = new Bytes(5);

  const tl2 = new TLAbscract();
  tl2.byteSize = 4;
  tl2.value = 'abcd';
  tl2.write(empty, 1);

  expect(empty.hex).toBe('0061626364');
});
