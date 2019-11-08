import TLFlags from './flags';
import Bytes from '../serialization/bytes';

test('TLFlags | read', () => {
  const data = new Bytes(new Uint8Array([10, 0, 0, 0]));

  const flags = new TLFlags();
  flags.read(data, 0);

  expect(flags.value).toBe(10);
  expect(flags.has(0)).toBe(false);
  expect(flags.has(1)).toBe(true);
  expect(flags.has(2)).toBe(false);
  expect(flags.has(3)).toBe(true);
});

test('TLFlags | write', () => {
  const empty = new Bytes(4);

  const flags = new TLFlags();

  flags.set(2); // 4
  flags.set(4); // 16
  flags.set(8); // 256

  flags.write(empty, 0);

  expect(empty.hex).toBe('14010000');
});
