import crc32 from './crc32';

test('crc32', () => {
  expect(crc32('req_pq_multi nonce:int128 = ResPQ')).toBe(0xbe7e8ef1);
});
