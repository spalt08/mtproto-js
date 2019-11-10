import SchemaProvider from './provider';

const cases = [
  ['req_pq', '1615239032'],
  ['msgs_all_info', '-1933520591'],
  ['req_pq_multi nonce:int128 = ResPQ', '-1099002127'],
];

test('SchemaProvider | find', () => {
  const schema = new SchemaProvider();

  for (let i = 0; i < cases.length; i += 1) {
    const [req, res] = cases[i];
    const f = schema.find(req);
    if (!f) throw new Error('INVALID');
    expect(f.id).toBe(res);
  }

  expect(schema.find(558156313)!.predicate).toBe('rpc_error');
});
