/* eslint-disable max-len */
import TLVector from './vector';
import { hex, Bytes } from '../serialization';
import { SchemaProvider } from '../schema';

test('TLVector | read', () => {
  const readcases = [
    ['long', [hex('216BE86C022BB4C3').uint], 2, hex('000015C4B51C01000000216BE86C022BB4C3')],
    ['Bool', [true, false], 0, hex('15C4B51C02000000b5757299379779bc')],
    ['int', [], 3, hex('00000015C4B51C00000000')],
    ['int', [], 3, hex('00000000000000')],
    ['int', [1, 2, 3], 0, hex('03000000010000000200000003000000')],
    ['string', ['test', 'hello'], 0, hex('15C4B51C0200000004746573740000000568656c6c6f0000')],
    ['bytes', ['abcdef', '123456', 'fefefe'], 0, hex('15C4B51C0300000003abcdef0312345603fefefe')],
  ];

  const schema = new SchemaProvider();

  for (let i = 0; i < readcases.length; i += 1) {
    const [type, res, offset, bytes] = readcases[i];

    const tl = new TLVector(type as string, schema);
    tl.read(bytes as Bytes, offset as number);

    expect(tl.value).toEqual(res);
  }
});

test('TLVector | write', () => {
  const readcases = [
    ['long', [hex('216BE86C022BB4C3').uint], 2, false, hex('000015C4B51C01000000216BE86C022BB4C3')],
    ['Bool', [true, false], 0, false, hex('15C4B51C02000000b5757299379779bc')],
    ['int', [], 3, false, hex('00000015C4B51C00000000')],
    ['int', [], 3, true, hex('00000000000000')],
    ['int', [1, 2, 3], 0, true, hex('03000000010000000200000003000000')],
    ['string', ['test', 'hello'], 0, false, hex('15C4B51C0200000004746573740000000568656c6c6f0000')],
    ['bytes', ['abcdef', '123456', 'fefefe'], 0, false, hex('15C4B51C0300000003abcdef0312345603fefefe')],
  ];

  const schema = new SchemaProvider();

  for (let i = 0; i < readcases.length; i += 1) {
    const [type, res, offset, isBare, bytes] = readcases[i];

    const empty = new Bytes((bytes as Bytes).length);

    const tl = new TLVector(type as string, schema, res as Array<any>, isBare as boolean);
    tl.write(empty as Bytes, offset as number);

    expect(empty.buffer).toEqual((bytes as Bytes).buffer);
  }
});
