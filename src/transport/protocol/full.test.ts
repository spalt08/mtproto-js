import { EncryptedMessage } from '../../message';
import { Bytes } from '../../serialization';
import Full from './full';
import crc32 from '../../utils/crc32';

test('transport | full', () => {
  const protocol = new Full();
  const payload = new Bytes(40);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg);

  expect(enveloped.slice(0, 4).int32).toEqual(payload.length + 12);
  expect(enveloped.slice(4, 8).int32).toEqual(0);
  expect(enveloped.slice(8, 8 + payload.length).hex).toEqual(payload.hex);
  expect(enveloped.slice(8 + payload.length).hex).toEqual(crc32(enveloped.slice(0, 8 + payload.length).raw).toString(16));

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped.buf.slice(0, payload.length).hex).toEqual(payload.hex);
  expect(unenveloped instanceof EncryptedMessage).toBeTruthy();

  const envelopedNext = protocol.wrap(msg);

  expect(envelopedNext.slice(4, 8).int32).toEqual(1);
});
