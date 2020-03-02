import SchemaProvider from './provider';

const cases = [
  ['req_pq', 1615239032],
  ['msgs_all_info', 2361446705],
  ['req_pq_multi nonce:int128 = ResPQ', 3195965169],
];

test('SchemaProvider | find', () => {
  const schema = new SchemaProvider();

  schema.define('req_pq_multi nonce:int128 = ResPQ');

  for (let i = 0; i < cases.length; i += 1) {
    const [req, res] = cases[i];
    const f = schema.find(req);

    if (!f) throw new Error('INVALID');
    expect(f.int32).toBe(res);
  }

  expect(schema.find(558156313)!.predicate).toBe('rpc_error');
});
