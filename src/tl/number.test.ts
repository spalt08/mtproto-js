import TLNumber from './number';
import { Reader32, Writer32 } from '../serialization';

test('TLNumber | read', () => {
  const tl = new TLNumber('int');

  tl.read(
    new Reader32(
      new Uint32Array([
        0x0a000100,
      ]),
    ),
  );

  expect(tl.value).toEqual(65546);
});

test('TLNumber | write', () => {
  const empty = new Writer32(new Uint32Array(1));

  const tl = new TLNumber('int', 0x01020304);
  tl.write(empty);

  expect(empty.buf).toEqual(
    new Uint32Array([
      0x04030201,
    ]),
  );
});
