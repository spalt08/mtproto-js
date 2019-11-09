import EncryptedMessage from './encrypted';
import { Bytes } from '../serialization';

test('message | encrypted create', () => {
  const data = new Bytes(32);

  data.randomize();

  const authKey = '0102030405060708';
  const msgKey = 'fffefdfcfbfaf9f8f7f6f5f4f3f2f1f0';

  const msg = new EncryptedMessage(data.length);

  msg.authKey = authKey;
  msg.key = msgKey;
  msg.data = data;

  expect(msg.buf.length).toBe(24 + data.length);

  expect(msg.buf.slice(0, 8).hex).toEqual(authKey);
  expect(msg.buf.slice(8, 24).hex).toEqual(msgKey);
  expect(msg.buf.slice(24).hex).toEqual(data.hex);
});
