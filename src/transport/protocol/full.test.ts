import { EncryptedMessage } from '../../message';
import { Bytes } from '../../serialization';
import Full from './full';
import crc32 from '../../utils/crc32';

test('transport | full', () => {
  const protocol = new Full();
  const payload = new Bytes(40);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.slice(0, 4).int32).toEqual(payload.length + 12);
  expect(enveloped.slice(4, 8).int32).toEqual(0);
  expect(enveloped.slice(8, 8 + payload.length).hex).toEqual(payload.hex);
  expect(enveloped.slice(8 + payload.length).hex).toEqual(`0${crc32(enveloped.slice(0, 8 + payload.length).raw).toString(16)}`.slice(-8));

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].slice(0, payload.length).hex).toEqual(payload.hex);
  expect(unenveloped[0]).toBe('encrypted');

  const envelopedNext = protocol.wrap(msg.buf);

  expect(envelopedNext.slice(4, 8).int32).toEqual(1);
});
