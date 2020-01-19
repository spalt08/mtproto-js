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

  buf.hex = 'abcde';
  expect(buf.hex).toBe('0abcde');

  buf.hex = 'ffffff';
  expect(buf.hex).toBe('ffffff');
});

test('Bytes | reverse', () => {
  const buf = new Bytes(new Uint8Array([10, 255, 127]));
  expect(buf.reverse().buffer).toEqual(new Uint8Array([127, 255, 10]));
});

test('Bytes | lhex', () => {
  const buf = new Bytes(new Uint8Array([10, 255, 127]));
  expect(buf.lhex).toBe('7fff0a');

  buf.lhex = '0a';
  expect(buf.hex).toBe('00000a');

  buf.lhex = 'ffffff';
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

test('Bytes | uint write 255 at 3 bytes', () => {
  const buf = new Bytes(3);

  buf.uint = 255;
  expect(buf.hex).toEqual('ff0000');
});

test('Bytes | big integer', () => {
  const buf = new Bytes(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
  expect(buf.uint).toEqual('090807060504030201');
});

test('Bytes | int', () => {
  const buf = new Bytes(4);

  buf.int32 = -790100132;
  expect(buf.hex).toBe('5c07e8d0');
  expect(buf.int32).toBe(-790100132);
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

test('Bytes | randomize', () => {
  const buf = new Bytes(10);

  buf.randomize();

  expect(buf.hex).not.toEqual('00000000000000000000');

  for (let i = 0; i < buf.length; i += 1) {
    expect(buf.buffer[i]).not.toEqual(0);
  }
});

test('Bytes | byte-string', () => {
  const buf = new Bytes('.a?');
  expect(buf.hex).toBe('2e613f');
});
