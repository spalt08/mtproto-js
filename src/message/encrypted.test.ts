import EncryptedMessage from './encrypted';
import { hex, Bytes } from '../serialization';

test('message | encrypted create', () => {
  const data = new Bytes(32);

  data.randomize();

  const authKey = hex('0102030405060708').raw;
  const msgKey = hex('fffefdfcfbfaf9f8f7f6f5f4f3f2f1f0').raw;

  const msg = new EncryptedMessage(data.length);

  msg.authKey = authKey;
  msg.key = msgKey;
  msg.data = data;

  expect(msg.buf.length).toBe(24 + data.length);

  expect(msg.buf.slice(0, 8).raw).toEqual(authKey);
  expect(msg.buf.slice(8, 24).raw).toEqual(msgKey);
  expect(msg.buf.slice(24).hex).toEqual(data.hex);
});
