import TLBoolean from './boolean';
import hex from '../serialization/hex';
import Bytes from '../serialization/bytes';

test('TLBoolean | read', () => {
  const data = hex('00b575729900');

  const tl = new TLBoolean('Bool');
  tl.read(data, 1);

  expect(tl.value).toBe(true);

  const tl2 = new TLBoolean('true', false, true);
  tl2.read(data, 1);

  expect(tl2.value).toBe(false);
});

test('TLBoolean | write', () => {
  const empty = new Bytes(6);

  const tl = new TLBoolean('Bool', true);
  tl.write(empty, 1);

  expect(empty.hex).toBe('00b575729900');

  const tl2 = new TLBoolean('Bool');
  tl2.write(empty, 1);

  expect(empty.hex).toBe('00379779bc00');

  const tl3 = new TLBoolean('true', true, true);
  tl3.write(empty, 1);

  expect(empty.hex).toBe('00379779bc00');
});
