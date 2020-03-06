/* eslint-disable max-len */

import TLConstructor from './constructor';
import { hex, Bytes, hex2raw } from '../serialization';
import { SchemaProvider } from '../schema';
import TypeLanguage from './tl';

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
      pq: hex2raw('17ed48941a08f981'),
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

test('TLConstructor | create', () => {
  const tl = new TypeLanguage();
  const nonce = hex('3E0549828CCA27E966B301A48FECE2FC').uint;
  const query = tl.create('req_pq', { nonce });

  expect(query.serialize().slice(0, 4).lhex).toBe('60469778');
});

test('TLConstructor | parse', () => {
  const schema = new SchemaProvider();
  const data = 'dcf8f1730200000001183f815fe2c75d010000001c0000000809c29e042111125fe2c75d1364c3c06d6c418b48cef284637978bd012c3f815fe2c75d030000002c000000016d5cf3042111125fe2c75d19ca44210cfeffff16496e76616c6964206d7367735f61636b207175657279000bb990795288b1e0e9daf5f4d55b0267';
  const buf = hex(data);

  const tl = new TLConstructor('msg_container', schema, false);
  tl.read(buf, 0);
});

test('TLConstructor | flags', () => {
  const tl = new TypeLanguage();

  tl.schema.put(tl.schema.layer, [
    {
      id: '531836966', int32: 531836966, method: 'help.getNearestDc', params: [], type: 'NearestDc',
    },
    {
      id: '2018609336',
      int32: 2018609336,
      method: 'initConnection',
      params: [{
        name: 'flags',
        type: '#',
      }, {
        name: 'api_id',
        type: 'int',
      }, {
        name: 'device_model',
        type: 'string',
      }, {
        name: 'system_version',
        type: 'string',
      }, {
        name: 'app_version',
        type: 'string',
      }, {
        name: 'system_lang_code',
        type: 'string',
      }, {
        name: 'lang_pack',
        type: 'string',
      }, {
        name: 'lang_code',
        type: 'string',
      }, {
        name: 'proxy',
        type: 'flags.0?InputClientProxy',
      }, {
        name: 'query',
        type: '!X',
      }],
      type: 'X',
    },
  ]);

  const init = tl.create('initConnection', {
    api_id: 1234,
    device_model: 'device',
    system_version: 'version',
    app_version: '1.0',
    system_lang_code: 'en',
    lang_pack: '',
    lang_code: 'en',
    query: { _: 'help.getNearestDc' },
  });

  const buf = init.serialize();

  expect(buf.slice(0, 4).int32).toBe(2018609336);
  expect(buf.slice(4, 8).int32).toBe(0);
});
