/* eslint-disable max-len */
import MessageV1 from './message.v1';
import TLConstructor from '../tl/constructor';
import { SchemaProvider } from '../schema';
import { hex } from '../serialization';

test('message.v1 | message create', () => {
  const tl = new TLConstructor('req_pq#60469778 nonce:int128 = ResPQ', new SchemaProvider(), false, {
    nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
  });

  const salt = '0102030405060708';
  const sid = 'fffefdfcfbfaf9f8';
  const seq = 111;
  const msgid = '51e57ac42770964a';

  const msg = new MessageV1(tl);
  msg.id = msgid;
  msg.salt = salt;
  msg.seqNo = seq;
  msg.sessionID = sid;

  expect(msg.buf.length).toBeGreaterThan(32 + tl.byteSize);
  expect(msg.buf.length % 16).toBe(0);

  expect(msg.buf.slice(0, 8).hex).toEqual(salt);
  expect(msg.buf.slice(8, 16).hex).toEqual(sid);
  expect(msg.buf.slice(16, 24).lhex).toEqual(msgid);
  expect(msg.buf.slice(24, 28).uint).toEqual(seq);
  expect(msg.buf.slice(28, 32).uint).toEqual(tl.byteSize);
  expect(msg.buf.slice(32, 32 + tl.byteSize).hex).toEqual('789746603E0549828CCA27E966B301A48FECE2FC'.toLowerCase());
});

test('message.v1 | encrypt', () => {
  const key = '1634f1e1213cf354131aa0f664a11125d323cf4522cceffa8d892b5e0bed9147cd496c1a4dbd50bf68c2e09915faa7911a903fbaeb82badad313d231340da176d429584021adece0e56466c2d612d09cb569fb0afc26605f70f1c41e41d93a19ae9d244f7572371113c056ead341bd6b29b5207dfd98d0fc46459054aae92ac28949aeab01d374e7e2f7b2906c485d63f99bf14cd51e3a23e5c63eb58cc0e3b4587a829c2fbbde45a0f6f54d2f2909cce8d1dc31b62b499b11753523ae1a60873b9eeee23beaa13e985222cd008b5346d8101893646916c7220b74d71039823ddeb4372143d7347c1592e167c5ca74a0e9c64f908d0a02ed09ece490b4c53cde';
  const data = hex('2aff4d2973bea7f10842c5218f982e4804a6600af338245e000000002800000065f7a375b26b3fe01918dcd568e75982a8306df4e5a62ebe098fd6daaf2aa7a1bc7fadda437f245eb157d6a9a552c25e');
  const message = new MessageV1(data);
  const encrypted = 'e5a62ebe098fd6daf8ebfa774c049b4e8ae768986e905194976bd960ae5ad3d8dc67740fe1df05de5e0c5864d9f96f64ad5a48193017219f528c543e29f5a3187517b1265be1ec6467290b7fdbae0a016fe44c259e21dd052c71fbaa09145ed699c1f26858385bc2';

  expect(message.encrypt(key).buf.hex).toEqual(encrypted);
});
