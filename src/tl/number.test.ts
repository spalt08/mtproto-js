import TLNumber from './number';
import { Bytes, hex } from '../serialization';

const cases = [
  ['int', 65546, 1, [0, 10, 0, 1, 0]],
  ['int64', '0000000000000001', 0, [1, 0, 0, 0, 0, 0, 0, 0]],
  ['int64', '000000fe00000000', 0, [0, 0, 0, 0, 254, 0, 0, 0]],
  ['long', 'c3b42b026ce86b21', 0, hex('216BE86C022BB4C3').buffer],
];

test('TLNumber | read', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [type, res, offset, bytes] = cases[i];

    const data = new Bytes(new Uint8Array(bytes as number[]));

    const tl = new TLNumber(type as string);
    tl.read(data, offset as number);

    expect(tl.value).toEqual(res);
  }
});

test('TLNumber | write', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [type, res, offset, bytes] = cases[i];

    const empty = new Bytes((bytes as number[]).length);

    const tl = new TLNumber(type as string, res as (number | string));
    tl.write(empty, offset as number);

    expect(empty.buffer).toEqual(new Uint8Array(bytes as number[]));
  }
});
