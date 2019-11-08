import SchemaProvider from './provider';

test('SchemaProvider | find', () => {
  const schema = new SchemaProvider();

  expect(schema.find('req_pq').id).toBe('1615239032');
  expect(schema.find('msgs_all_info').id).toBe('-1933520591');
  expect(schema.find(558156313).predicate).toBe('rpc_error');
  expect(schema.find('req_pq_multi nonce:int128 = ResPQ').id).toBe('-1099002127');
});
