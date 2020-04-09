import Obfuscation from './obfuscation';

test('transport | length', () => {
  const obf = new Obfuscation();

  const initpayload = obf.init(0);

  expect(initpayload.length).toBe(16);
  expect(initpayload[0]).not.toBe(0x00);
});

test('transport | obfuscation init', () => {
  const obf = new Obfuscation();

  const initpayload = obf.init(
    0xefefefef,
    new Uint32Array([
      0xffabcdef, 0x07db79b8, 0xb57d3b12, 0x9f161c25, 0xeaf1632e, 0x36d15f06, 0xa71cf4ed, 0x8e18ef11,
      0xc8719c71, 0xe1c2e66c, 0x91d96d97, 0x6dae9c45, 0x6988cad6, 0xfd0efd51, 0x8aa7cdb3, 0xfeff2430,
    ]),
  );

  expect(initpayload).toEqual(
    new Uint32Array([
      0xffabcdef, 0x07db79b8, 0xb57d3b12, 0x9f161c25, 0xeaf1632e, 0x36d15f06, 0xa71cf4ed, 0x8e18ef11,
      0xc8719c71, 0xe1c2e66c, 0x91d96d97, 0x6dae9c45, 0x6988cad6, 0xfd0efd51, 0xcbb56a50, 0x590e498f,
    ]),
  );
});

test('transport | obfuscation encode', () => {
  const obf = new Obfuscation();
  const zeroed = new Uint32Array(4);

  obf.init(
    0xefefefef,
    new Uint32Array([
      0xffabcdef, 0x76d251b6, 0x65958c01, 0x50cd95d0, 0x474e89ca, 0x22b36c94, 0xc6ab68a3, 0x14b2609f,
      0xf02d6f8d, 0x6b035426, 0x09b2894c, 0x29cfadde, 0x59427f1b, 0x322189ea, 0x429bf094, 0xfeff6035,
    ]),
  );

  expect(obf.encode(zeroed)).toEqual(new Uint32Array([0xf5d5e342, 0xbfe5dae9, 0xc5e2453b, 0x56696082]));
  expect(obf.encode(zeroed)).toEqual(new Uint32Array([0xf81d3d98, 0x0a3c9b56, 0x500b5fa5, 0x92af2fa2]));
  expect(obf.encode(zeroed)).toEqual(new Uint32Array([0xa8f13906, 0x1e47bf70, 0xb119d1e5, 0x15422956]));

  expect(obf.decode(zeroed)).toEqual(new Uint32Array([0x47fd70eb, 0x60c6fc24, 0x76cdd89a, 0xca98c4cd]));
  expect(obf.decode(zeroed)).toEqual(new Uint32Array([0xe8eaa6ad, 0xd12249ba, 0x8e2dd055, 0xd4dcffdb]));
  expect(obf.decode(zeroed)).toEqual(new Uint32Array([0xbc251bcf, 0xf191ac7e, 0x8fc1a7ff, 0x4d25be15]));
});

test('transport | obfuscation errors', () => {
  let raised = 0;

  const obf = new Obfuscation();

  try {
    obf.encode(new Uint32Array(4));
  } catch (e) {
    expect(e.message.length).toBeGreaterThan(0);
    raised++;
  }

  try {
    obf.decode(new Uint32Array(4));
  } catch (e) {
    expect(e.message.length).toBeGreaterThan(0);
    raised++;
  }

  expect(raised).toBe(2);
});
