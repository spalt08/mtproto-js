import { PlainMessage, EncryptedMessage } from '../../message';
import { Bytes } from '../../serialization';
import Intermediate from './intermediate';

test('transport | intermediate short', () => {
  const protocol = new Intermediate();
  const payload = new Bytes(40);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.hex).toEqual(`28000000${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].hex).toEqual(payload.hex);
  expect(unenveloped[0]).toBe('encrypted');
});

test('transport | intermediate long', () => {
  const protocol = new Intermediate();
  const payload = new Bytes(1032);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.hex).toEqual(`08040000${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].hex).toEqual(payload.hex);
});

test('transport | intermediate plain', () => {
  const protocol = new Intermediate();
  const payload = new Bytes(52);

  payload.slice(8).randomize();

  const msg = new PlainMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.hex).toEqual(`34000000${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[0]).toBe('plain');
});
