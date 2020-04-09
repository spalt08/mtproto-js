import { reverse32, i2abLow } from './utils';

test('serialization | reverse32', () => {
  const buffer = new Uint32Array([0x01020304, 0x05060708]);

  expect(reverse32(buffer)).toEqual(new Uint32Array([0x08070605, 0x04030201]));
});

test('serialization | i2abLow', () => {
  expect(
    i2abLow(new Uint32Array([0x01020304, 0x05060708])),
  ).toEqual(
    new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]).buffer,
  );
});

test('serialization | i2abBig', () => {
  expect(
    i2abLow(new Uint32Array([0x01020304, 0x05060708])) instanceof ArrayBuffer,
  ).toBeTruthy();
});
