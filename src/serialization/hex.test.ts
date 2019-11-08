import hex from './hex';

test('hex | conversion', () => {
  const buf = hex('0feff00');

  expect(buf.length).toBe(4);
  expect(buf.buffer).toEqual(new Uint8Array([0, 254, 255, 0]));
});
