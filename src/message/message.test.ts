import Message from './message';
import { Reader32, Writer32 } from '../serialization';


test('message | message create', () => {
  const payload = new Uint32Array([
    0x63241605, 0x3E054982, 0x8CCA27E9, 0x66B301A4, 0x8FECE2FC, 0xA5CF4D33, 0xF4A11EA8, 0x77BA4AA5, 0x73907330, 0x0817ED48,
    0x941A08F9, 0x81000000, 0x15C4B51C, 0x01000000, 0x216BE86C, 0x022BB4C3,
  ]);

  const salt = '0102030405060708';
  const sid = 'fffefdfcfbfaf9f8';
  const seq = 111;
  const msgid = '51e57ac42770964a';

  const msg = new Message(payload, true);
  msg.id = msgid;
  msg.salt = salt;
  msg.seqNo = seq;
  msg.sessionID = sid;
  msg.len();

  expect(msg.buf.length).toBeGreaterThan(8 + payload.length);
  expect(msg.buf.length % 4).toBe(0);

  const reader = new Reader32(msg.buf);

  expect(reader.long()).toBe(salt);
  expect(reader.long()).toBe(sid);
  expect(reader.long()).toBe(msgid);
  expect(reader.int32()).toBe(seq);
  expect(reader.int32()).toBe(payload.length * 4);
  expect(msg.data).toEqual(payload);

  expect(msg.id).toBe(msgid);
  expect(msg.seqNo).toBe(seq);

  expect(msg.reader instanceof Reader32).toBeTruthy();
  expect(msg.writer instanceof Writer32).toBeTruthy();
});

test('message | message encrypt', () => {
  const key = new Uint32Array([
    0x12f3e1fc, 0xeeaf1761, 0x5e74203d, 0xab70feb2, 0xb63f3523, 0x927a15de, 0xe19d42d3, 0x3c59fb2a, 0xc7241193, 0x56912674,
    0x264af9cf, 0xb19574f7, 0xf4dcfaa0, 0xf7094ade, 0x8eaf1e3e, 0x317aeab5, 0xdaf543c7, 0xf06b8c95, 0x0e45884e, 0xf2837e8d,
    0xc3d7dba9, 0xce5c41c0, 0x78f1d7b6, 0x5c394434, 0x8e8fcb3a, 0x0342eaec, 0x27138e13, 0x66da4509, 0x35b6ca2a, 0x5f6ded45,
    0xc73fcd13, 0x771ea100, 0x4be21b39, 0xa9935621, 0xa8b559c7, 0x411e8fa6, 0x271ec445, 0x5c2975b1, 0x5fa65957, 0x5c29bec7,
    0x18d46288, 0xdafdddef, 0xdd8f0360, 0x46bec48a, 0x0fbae62a, 0x3cc5c76c, 0xbb07e609, 0x21c3c943, 0xa8bf0606, 0x3efa421d,
    0x9eecd692, 0x409a5f3e, 0x3829c9a8, 0x43cc891e, 0xd131e26b, 0x1afcd31f, 0x48578579, 0xe37255d2, 0x17e26415, 0x1bd47c81,
    0xae22d928, 0xf20e0f01, 0x7aadedd7, 0x19b92ac1,
  ]);

  const keyid = '9d80b6d3d4598cc1';

  const message = new Message(new Uint32Array([0x3212D579, 0xEE35452E, 0xD23E0D0C, 0x92841AA7, 0xD31B2E9B, 0xDEF2151E, 0x80D15860, 0x311C85DB]));

  expect(message.encrypt(key, keyid).buf).toEqual(
    new Uint32Array([
      0xc18c59d4, 0xd3b6809d, 0x15f5716b, 0xaed3fca1, 0x2432ef57, 0x54dab007, 0xd9913153, 0xe4d91685, 0x223c44de, 0xd7038708,
      0x4792d25e, 0xabc00fed, 0x0552ac04, 0x09930e8b,
    ]),
  );
});

test('message | message generate id', () => {
  expect(Message.GenerateID().length).toBe(16);
});
