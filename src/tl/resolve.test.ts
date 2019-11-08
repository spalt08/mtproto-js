import resolve from './resolve';
import { SchemaProvider } from '../schema';
import TLNumber from './number';
import TLVector from './vector';
import TLBoolean from './boolean';

const cases = [
  ['long', TLNumber],
  ['vector<long>', TLVector],
  ['flags.1?true', TLBoolean],
];

test('TL | resolve', () => {
  const schema = new SchemaProvider();

  for (let i = 0; i < cases.length; i += 1) {
    const [type, inst] = cases[i];
    const res = resolve(type as string, schema);

    expect(res instanceof (inst as Function)).toEqual(true);
  }
});
