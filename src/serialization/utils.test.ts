import { reverse32 } from './utils';

test('serialization | reverse32', () => {
  const buffer = new Uint32Array([0x01020304, 0x05060708]);

  expect(reverse32(buffer)).toEqual(new Uint32Array([0x08070605, 0x04030201]));
});
