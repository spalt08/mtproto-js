/* eslint-disable max-len */

import TLConstructor from './constructor';
import { Reader32 } from '../serialization';
import { SchemaProvider } from '../schema';

test('TLConstructor | read', () => {
  const schema = new SchemaProvider();
  const tl = new TLConstructor('resPQ', schema, false);

  tl.read(
    new Reader32(
      new Uint32Array([
        0x63241605, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC, 0xA5CF4D33, 0xF4A11EA8, 0x77BA4AA5, 0x73907330, 0x0817ED48,
        0x941A08F9, 0x81000000, 0x15C4B51C, 0x01000000, 0x216BE86C, 0x022BB4C3,
      ]),
    ),
  );

  expect(tl.value).toEqual({
    _: 'resPQ',
    nonce: new Uint32Array([0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]),
    server_nonce: new Uint32Array([0xA5CF4D33, 0xF4A11EA8, 0x77BA4AA5, 0x73907330]),
    pq: new Uint8Array([0x17, 0xed, 0x48, 0x94, 0x1a, 0x08, 0xf9, 0x81]).buffer,
    server_public_key_fingerprints: [
      'c3b42b026ce86b21',
    ],
  });
});

test('TLConstructor | write', () => {
  const schema = new SchemaProvider();
  const tl = new TLConstructor('req_pq#60469778 nonce:int128 = ResPQ', schema, false, {
    _: 'req_pq',
    nonce: new Uint32Array([0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]),
  });

  expect(tl.serialize()).toEqual(new Uint32Array([0x78974660, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC]));
});

// test('TLConstructor | create', () => {
//   const tl = new TypeLanguage();
//   const nonce = hex('3E0549828CCA27E966B301A48FECE2FC').uint;
//   const query = tl.create('req_pq', { nonce });

//   expect(query.serialize().slice(0, 4).lhex).toBe('60469778');
// });

// test('TLConstructor | parse', () => {
//   const schema = new SchemaProvider();
//   const data = 'dcf8f1730200000001183f815fe2c75d010000001c0000000809c29e042111125fe2c75d1364c3c06d6c418b48cef284637978bd012c3f815fe2c75d030000002c000000016d5cf3042111125fe2c75d19ca44210cfeffff16496e76616c6964206d7367735f61636b207175657279000bb990795288b1e0e9daf5f4d55b0267';
//   const buf = hex(data);

//   const tl = new TLConstructor('msg_container', schema, false);
//   tl.read(buf, 0);
// });

// test('TLConstructor | flags', () => {
//   const tl = new TypeLanguage();

//   tl.schema.put(tl.schema.layer, [
//     {
//       id: '531836966', int32: 531836966, method: 'help.getNearestDc', params: [], type: 'NearestDc',
//     },
//     {
//       id: '2018609336',
//       int32: 2018609336,
//       method: 'initConnection',
//       params: [{
//         name: 'flags',
//         type: '#',
//       }, {
//         name: 'api_id',
//         type: 'int',
//       }, {
//         name: 'device_model',
//         type: 'string',
//       }, {
//         name: 'system_version',
//         type: 'string',
//       }, {
//         name: 'app_version',
//         type: 'string',
//       }, {
//         name: 'system_lang_code',
//         type: 'string',
//       }, {
//         name: 'lang_pack',
//         type: 'string',
//       }, {
//         name: 'lang_code',
//         type: 'string',
//       }, {
//         name: 'proxy',
//         type: 'flags.0?InputClientProxy',
//       }, {
//         name: 'query',
//         type: '!X',
//       }],
//       type: 'X',
//     },
//   ]);

//   const init = tl.create('initConnection', {
//     api_id: 1234,
//     device_model: 'device',
//     system_version: 'version',
//     app_version: '1.0',
//     system_lang_code: 'en',
//     lang_pack: '',
//     lang_code: 'en',
//     query: { _: 'help.getNearestDc' },
//   });

//   const buf = init.serialize();

//   expect(buf.slice(0, 4).int32).toBe(2018609336);
//   expect(buf.slice(4, 8).int32).toBe(0);
// });
