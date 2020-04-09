import TLFlags from './flags';
import { Reader32, Writer32 } from '../serialization';

test('TLFlags | read', () => {
  const flags = new TLFlags();

  flags.read(
    new Reader32(
      new Uint32Array([
        0x0a000000,
      ]),
    ),
  );

  expect(flags.value).toBe(10);
  expect(flags.has(0)).toBe(false);
  expect(flags.has(1)).toBe(true);
  expect(flags.has(2)).toBe(false);
  expect(flags.has(3)).toBe(true);
});

test('TLFlags | write', () => {
  const empty = new Writer32(new Uint32Array(1));

  const flags = new TLFlags();

  flags.set(2); // 4
  flags.set(4); // 16
  flags.set(8); // 256

  flags.write(empty);

  expect(empty.buf[0]).toBe(0x14010000);
});
