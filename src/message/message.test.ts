import Message from './message';
import TLConstructor from '../tl/constructor';
import { SchemaProvider } from '../schema';
import { hex } from '../serialization';

test('message | message create', () => {
  const tl = new TLConstructor('req_pq#60469778 nonce:int128 = ResPQ', new SchemaProvider(), false, {
    nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
  });

  const salt = '0102030405060708';
  const sid = 'fffefdfcfbfaf9f8';
  const seq = 111;
  const msgid = '51e57ac42770964a';

  const msg = new Message(tl);
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
