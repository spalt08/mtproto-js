import Reader32 from './reader';

test('serialization | reader32 res_pq', () => {
  const buffer = new Uint32Array([
    0x00000000, 0x00000000, 0x01C8831E, 0xC97AE551, 0x40000000, 0x63241605, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC, 0xA5CF4D33,
    0xF4A11EA8, 0x77BA4AA5, 0x73907330, 0x0817ED48, 0x941A08F9, 0x81000000, 0x15C4B51C, 0x01000000, 0x216BE86C, 0x022BB4C3,
  ]);

  const reader = new Reader32(buffer);

  expect(reader.long()).toBe('00'.repeat(8));
  expect(reader.int64()).toBe('51e57ac91e83c801');
  expect(reader.int32()).toBe(64);
  expect(reader.int32()).toBe(0x05162463);
  expect(reader.int128()).toEqual(new Uint32Array([0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]));
  expect(reader.int128()).toEqual(new Uint32Array([0xA5CF4D33, 0xF4A11EA8, 0x77BA4AA5, 0x73907330]));
  expect(reader.bytes()).toEqual(new Uint8Array([0x17, 0xED, 0x48, 0x94, 0x1A, 0x08, 0xF9, 0x81]).buffer);
  expect(reader.int32()).toBe(0x1cb5c415);
  expect(reader.int32()).toBe(1);
  expect(reader.long()).toBe('c3b42b026ce86b21');
});

test('serialization | reader32 string', () => {
  const buffer = new Uint32Array([
    0xfe2c0100, 0x4c6f7265, 0x6d206970, 0x73756d20, 0x646f6c6f, 0x72207369, 0x7420616d, 0x65742c20, 0x636f6e73, 0x65637465, 0x74757220,
    0x61646970, 0x69736369, 0x6e672065, 0x6c69742e, 0x20536564, 0x20636f6e, 0x67756520, 0x64696374, 0x756d2065, 0x6e696d20, 0x65676574,
    0x20636f6e, 0x76616c6c, 0x69732e20, 0x51756973, 0x71756520, 0x696d7065, 0x72646965, 0x7420636f, 0x6e76616c, 0x6c697320, 0x72697375,
    0x73206e65, 0x63207665, 0x6e656e61, 0x7469732e, 0x20536564, 0x20616c69, 0x71756574, 0x20706861, 0x72657472, 0x6120706f, 0x72747469,
    0x746f722e, 0x20437572, 0x61626974, 0x75722065, 0x66666963, 0x69747572, 0x20696163, 0x756c6973, 0x20746f72, 0x746f7220, 0x6574206c,
    0x6163696e, 0x69612e20, 0x41656e65, 0x616e2063, 0x6f6e7661, 0x6c6c6973, 0x20697073, 0x756d2063, 0x6f6d6d6f, 0x646f2065, 0x6c656d65,
    0x6e74756d, 0x20706f72, 0x74612e20, 0x436c6173, 0x73206170, 0x74656e74, 0x20746163, 0x69746920, 0x706f7375, 0x6572652e, 0x40000000,
  ]);

  const reader = new Reader32(buffer);

  expect(reader.string()).toBe(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue dictum enim eget convallis. Quisque imperdiet convallis risus nec venenatis. '
  + 'Sed aliquet pharetra porttitor. Curabitur efficitur iaculis tortor et lacinia. Aenean convallis ipsum commodo elementum porta. Class aptent '
  + 'taciti posuere.',
  );

  expect(reader.int32()).toBe(0x40);
});

test('serialization | reader32 int256', () => {
  const buffer = new Uint32Array([
    0x73756d20, 0x646f6c6f, 0x72207369, 0x7420616d,
    0x65742c20, 0x636f6e73, 0x65637465, 0x74757220,
  ]);

  const reader = new Reader32(buffer);

  expect(reader.int256()).toEqual(buffer);
});

test('serialization | reader32 bool', () => {
  const buffer = new Uint32Array([
    0xb5757299, 0x37bc7997,
  ]);

  const reader = new Reader32(buffer);

  expect(reader.bool()).toEqual(true);
  expect(reader.bool()).toEqual(false);
});


// test('serialization | reader32 double', () => {
//   const buffer = new Uint32Array([
//     0x3F880000, 0x00000000,
//   ]);

//   const reader = new Reader32(buffer);

//   expect(reader.double()).toEqual(1.72325e-319);
// });
