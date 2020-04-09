import TLBoolean from './boolean';
import { Reader32, Writer32 } from '../serialization';

test('TLBoolean | read', () => {
  const tl = new TLBoolean('Bool');

  tl.read(
    new Reader32(
      new Uint32Array([
        0xb5757299,
      ]),
    ),
  );

  expect(tl.value).toBeTruthy();
});

test('TLBoolean | write', () => {
  const empty = new Writer32(new Uint32Array(1));

  const tl = new TLBoolean('Bool', true);
  tl.write(empty);

  expect(empty.buf[0]).toEqual(0xb5757299);
});
