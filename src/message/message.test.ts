/* eslint-disable max-len */
import Message from './message';
import TLConstructor from '../tl/constructor';
import { SchemaProvider } from '../schema';
import { hex } from '../serialization';

test('message | message create from undefined', () => {
  try {
    // @ts-ignore
    new Message(undefined); // eslint-disable-line
  } catch (e) {
    expect(e.message).toBe('Unable to create message with undefined');
  }
});

test('message | create from bytes', () => {
  const data = hex('3212D579EE35452ED23E0D0C92841AA7D31B2E9BDEF2151E80D15860311C85DB');
  const msg = new Message(data);

  expect(msg.buf.hex).toBe(data.hex);
});

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
  msg.len();

  expect(msg.buf.length).toBeGreaterThan(32 + tl.byteSize);
  expect(msg.buf.length % 16).toBe(0);

  expect(msg.id).toBe(msgid);

  expect(msg.buf.slice(0, 8).hex).toEqual(salt);
  expect(msg.buf.slice(8, 16).hex).toEqual(sid);
  expect(msg.buf.slice(16, 24).lhex).toEqual(msgid);
  expect(msg.buf.slice(24, 28).uint).toEqual(seq);
  expect(msg.buf.slice(28, 32).uint).toEqual(tl.byteSize);
  expect(msg.buf.slice(32, 32 + tl.byteSize).hex).toEqual('789746603E0549828CCA27E966B301A48FECE2FC'.toLowerCase());
});

test('message | encrypt', () => {
  const key = '12f3e1fceeaf17615e74203dab70feb2b63f3523927a15dee19d42d33c59fb2ac724119356912674264af9cfb19574f7f4dcfaa0f7094ade8eaf1e3e317aeab5daf543c7f06b8c950e45884ef2837e8dc3d7dba9ce5c41c078f1d7b65c3944348e8fcb3a0342eaec27138e1366da450935b6ca2a5f6ded45c73fcd13771ea1004be21b39a9935621a8b559c7411e8fa6271ec4455c2975b15fa659575c29bec718d46288dafdddefdd8f036046bec48a0fbae62a3cc5c76cbb07e60921c3c943a8bf06063efa421d9eecd692409a5f3e3829c9a843cc891ed131e26b1afcd31f48578579e37255d217e264151bd47c81ae22d928f20e0f017aadedd719b92ac1';
  const data = hex('3212D579EE35452ED23E0D0C92841AA7D31B2E9BDEF2151E80D15860311C85DB');
  const message = new Message(data);
  const encrypted = 'c18c59d4d3b6809d15f5716baed3fca12432ef5754dab007d9913153e4d91685223c44ded70387084792d25eabc00fed0552ac0409930e8b';

  expect(message.encrypt(key).buf.hex).toEqual(encrypted);
});
