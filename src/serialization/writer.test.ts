import Writer32 from './writer';

test('serialization | writer32 res_pq', () => {
  const writer = new Writer32(new Uint32Array(21));

  writer.long('00'.repeat(8));
  writer.int64('51e57ac91e83c801');

  expect(writer.buf).toEqual(
    new Uint32Array([
      0x00000000, 0x00000000, 0x01C8831E, 0xC97AE551, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
      0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
    ]),
  );

  writer.int32(64);
  writer.int32(0x05162463);
  writer.int128(new Uint32Array([0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]));
  writer.int128(new Uint32Array([0xA5CF4D33, 0xF4A11EA8, 0x77BA4AA5, 0x73907330]));
  writer.bytes(new Uint8Array([0x17, 0xED, 0x48, 0x94, 0x1A, 0x08, 0xF9, 0x81]).buffer);
  writer.int32(0x1cb5c415);
  writer.int32(1);
  writer.int64('c3b42b026ce86b21');

  expect(writer.buf).toEqual(
    new Uint32Array([
      0x00000000, 0x00000000, 0x01C8831E, 0xC97AE551, 0x40000000, 0x63241605, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC, 0xA5CF4D33,
      0xF4A11EA8, 0x77BA4AA5, 0x73907330, 0x0817ED48, 0x941A08F9, 0x81000000, 0x15C4B51C, 0x01000000, 0x216BE86C, 0x022BB4C3,
    ]),
  );
});
