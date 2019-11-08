import BigInt from 'big-integer';
import Bytes from './bytes';

test('Bytes | constructor number', () => {
  const buf = new Bytes(2);
  expect(buf instanceof Bytes).toBe(true);
  expect(buf.buffer instanceof Uint8Array).toBe(true);
  expect(buf.length).toBe(2);
});

test('Bytes | constructor arraybuffer', () => {
  const buf = new Bytes(new ArrayBuffer(5));
  expect(buf instanceof Bytes).toBe(true);
  expect(buf.buffer instanceof Uint8Array).toBe(true);
  expect(buf.length).toBe(5);
});

test('Bytes | constructor uint8array', () => {
  const buf = new Bytes(new Uint8Array(10));
  expect(buf instanceof Bytes).toBe(true);
  expect(buf.buffer instanceof Uint8Array).toBe(true);
  expect(buf.length).toBe(10);
});

test('Bytes | hex', () => {
  const buf = new Bytes(new Uint8Array([10, 255, 127]));
  expect(buf.hex).toBe('0aff7f');

  buf.hex = 'a';
  expect(buf.hex).toBe('0a0000');

  buf.hex = 'ffffff';
  expect(buf.hex).toBe('ffffff');
});

test('Bytes | raw string', () => {
  const buf = new Bytes(new Uint8Array([97, 98, 99]));
  expect(buf.raw).toBe('abc');

  buf.raw = '123';
  expect(buf.raw).toBe('123');
});

test('Bytes | uint', () => {
  const buf = new Bytes(new Uint8Array([187, 1, 0, 0]));
  expect(buf.uint).toBe(443);

  buf.uint = 10;
  expect(buf.buffer).toEqual(new Uint8Array([10, 0, 0, 0]));

  buf.uint = 256;
  expect(buf.buffer).toEqual(new Uint8Array([0, 1, 0, 0]));
});

test('Bytes | big integer', () => {
  const buf = new Bytes(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  expect(buf.uint).toEqual(BigInt('166599134359138271745'));
});

test('Bytes | int', () => {
  const buf = new Bytes(4);

  buf.int = -790100132;
  expect(buf.hex).toBe('5c07e8d0');
  expect(buf.int).toBe(-790100132);
});


test('Bytes | slice', () => {
  const buf = new Bytes(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));

  const sliced = buf.slice(3, 5);
  expect(sliced.hex).toBe('0405');

  const sliced2 = buf.slice(6);
  expect(sliced2.hex).toBe('070809');

  expect(sliced.buffer.buffer).toEqual(buf.buffer.buffer);
  expect(sliced2.buffer.buffer).toEqual(buf.buffer.buffer);
});
