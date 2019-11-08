import parse from './parse';
import { SchemaEntity } from './types';

const cases: Record<string, SchemaEntity> = {
  'req_pq_multi nonce:int128 = ResPQ': {
    id: '-1099002127',
    predicate: 'req_pq_multi',
    params: [
      { name: 'nonce', type: 'int128' },
    ],
    type: 'ResPQ',
  },
};

test('Schema | parse', () => {
  const expressions = Object.keys(cases);

  for (let i = 0; i < expressions.length; i += 1) {
    const result = parse(expressions[i]);
    expect(result).toEqual(cases[expressions[i]]);
  }
});
