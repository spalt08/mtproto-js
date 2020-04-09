import TLAbscract from './abstract';
import { Writer32 } from '../serialization';

// test('TLAbsctract | read', () => {
//   const data = new Bytes(new Uint8Array([1, 97, 98, 99, 100]));

//   const tl = new TLAbscract();
//   tl.byteSize = 4;
//   tl.read(data, 1);

//   expect(tl.value).toBe('abcd');
// });

test('TLAbsctract | write', () => {
  const empty = new Writer32(new Uint32Array(1));

  const tl2 = new TLAbscract();
  tl2.byteSize = 4;
  tl2.value = 0x01020304;
  tl2.write(empty);

  expect(empty.buf[0]).toEqual(0x04030201);
});
