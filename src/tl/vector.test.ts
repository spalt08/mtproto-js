/* eslint-disable max-len */
import TLVector from './vector';
import { hex, Bytes, hex2raw } from '../serialization';
import { SchemaProvider } from '../schema';

const cases = [
  ['long', [hex('216BE86C022BB4C3').uint], 2, false, hex('000015C4B51C01000000216BE86C022BB4C3')],
  ['Bool', [true, false], 0, false, hex('15C4B51C02000000b5757299379779bc')],
  ['int', [], 3, false, hex('00000015C4B51C00000000')],
  ['int', [], 3, true, hex('00000000000000')],
  ['int', [1, 2, 3], 0, true, hex('03000000010000000200000003000000')],
  ['string', ['test', 'hello'], 0, false, hex('15C4B51C0200000004746573740000000568656c6c6f0000')],
  ['bytes', [hex2raw('abcdef'), hex2raw('123456'), hex2raw('fefefe')], 0, false, hex('15C4B51C0300000003abcdef0312345603fefefe')],
];

test('TLVector | read', () => {
  const schema = new SchemaProvider();

  for (let i = 0; i < cases.length; i += 1) {
    const [type, res, offset,, bytes] = cases[i];

    const tl = new TLVector(type as string, schema);
    tl.read(bytes as Bytes, offset as number);

    expect(tl.value).toEqual(res);
  }
});

test('TLVector | write', () => {
  const schema = new SchemaProvider();

  for (let i = 0; i < cases.length; i += 1) {
    const [type, res, offset, isBare, bytes] = cases[i];

    const empty = new Bytes((bytes as Bytes).length);

    const tl = new TLVector(type as string, schema, res as Array<any>, isBare as boolean);
    tl.write(empty as Bytes, offset as number);

    expect(empty.buffer).toEqual((bytes as Bytes).buffer);
  }
});
