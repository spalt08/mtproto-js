import encrypt from './encrypt';
import { PredefinedKeys } from './keys';

test('rsa | encrypt', () => {
  const data = new Uint8Array([
    0xDB, 0x76, 0x1C, 0x27, 0x71, 0x8A, 0x23, 0x05, 0x04, 0x4F,
    0x71, 0xF2, 0xAD, 0x95, 0x16, 0x29, 0xD7, 0x8B, 0x24, 0x49,
  ]);

  expect(encrypt(data, PredefinedKeys[0].n, PredefinedKeys[0].e)).toEqual(
    new Uint32Array([
      0xa4bd9732, 0xc5bf5fbf, 0x8d3bf557, 0x81f7d718, 0xa719d3cd, 0x4525ef80,
      0xe9865963, 0xf1f48cdc, 0x44d8e3d4, 0xb508cc83, 0x9d01f5b5, 0x1c0724cc,
      0x1ec70fbd, 0x738a4b6a, 0x2529cea0, 0x263133d9, 0xc5a7d6fc, 0xcba118d6,
      0x2089d3d5, 0x7b035a37, 0xfe083399, 0xc00570d1, 0x0482e9da, 0xef324975,
      0xeb4572a1, 0x0bafe2eb, 0x77a82043, 0x01ea8d04, 0x11ff66b6, 0xcb8104c8,
      0xf596f989, 0xf95f381e, 0x970b8eaf, 0x22a84d43, 0x79617197, 0xe14227af,
      0xdf452a5e, 0x151d89b0, 0x07177a4c, 0xef9b5d60, 0xd6c1da07, 0x8568dc0b,
      0x10ec4cdb, 0xfbab81b9, 0x5c6f7f41, 0x4c6ba099, 0xa8c2d650, 0xe0f38ab0,
      0x87518dc8, 0xbb922a61, 0xaa3593dd, 0x67f8cc28, 0x411588e7, 0x28d83a90,
      0x62b901b6, 0x09073f11, 0xfa94ff2b, 0x8f9fd42d, 0x2892a5d5, 0xffbe2825,
      0xa1bb0b92, 0x63a5e1d5, 0x3bff4f6e, 0x325d46f2,
    ]),
  );
});
