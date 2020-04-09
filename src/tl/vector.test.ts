/* eslint-disable max-len */
import TLVector from './vector';
import { Reader32, Writer32 } from '../serialization';
import { SchemaProvider } from '../schema';

test('TLVector | read', () => {
  const schema = new SchemaProvider();
  const tl = new TLVector('string', schema);

  tl.read(
    new Reader32(
      new Uint32Array([
        0x15C4B51C, 0x02000000, 0x04746573, 0x74000000, 0x0568656c, 0x6c6f0000,
      ]),
    ),
  );

  expect(tl.value).toEqual(['test', 'hello']);
});

test('TLVector | write', () => {
  const result = new Uint32Array([
    0x15C4B51C, 0x02000000, 0x04746573, 0x74000000, 0x0568656c, 0x6c6f0000,
  ]);
  const schema = new SchemaProvider();
  const tl = new TLVector('string', schema, ['test', 'hello']);
  const empty = new Writer32(new Uint32Array(result.length));

  tl.write(empty);

  expect(empty.buf).toEqual(result);
});
