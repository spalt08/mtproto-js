/* eslint-disable max-len */

import TLConstructor from './constructor';
import { hex, Bytes } from '../serialization';
import { SchemaProvider } from '../schema';

const cases = [
  {
    formula: 'req_pq#60469778 nonce:int128 = ResPQ',
    value: {
      _: 'req_pq',
      nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
    },
    isBare: false,
    offset: 3,
    serialized: hex('000000789746603E0549828CCA27E966B301A48FECE2FC'),
  },
  {
    formula: 'resPQ',
    value: {
      _: 'resPQ',
      nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
      server_nonce: hex('A5CF4D33F4A11EA877BA4AA573907330').uint,
      pq: '17ed48941a08f981',
      server_public_key_fingerprints: [
        hex('216BE86C022BB4C3').uint,
      ],
    },
    isBare: false,
    offset: 0,
    serialized: hex('632416053E0549828CCA27E966B301A48FECE2FCA5CF4D33F4A11EA877BA4AA5739073300817ED48941A08F98100000015C4B51C01000000216BE86C022BB4C3'),
  },
];

test('TLConstructor | read', () => {
  const schema = new SchemaProvider();

  for (let i = 0; i < cases.length; i += 1) {
    const {
      formula, value, serialized, isBare, offset,
    } = cases[i];

    const tl = new TLConstructor(formula, schema, isBare);
    tl.read(serialized, offset);

    expect(tl.value).toEqual(value);
  }
});

test('TLConstructor | write', () => {
  const schema = new SchemaProvider();

  for (let i = 0; i < cases.length; i += 1) {
    const {
      formula, value, serialized, isBare, offset,
    } = cases[i];

    const empty = new Bytes(serialized.length);

    const tl = new TLConstructor(formula, schema, isBare, value);
    tl.write(empty, offset);

    expect(empty.buffer).toEqual(serialized.buffer);
  }
});
