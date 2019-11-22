import { PlainMessage, EncryptedMessage } from '../../message';
import { Bytes } from '../../serialization';
import Abridged from './abridged';

test('transport | abridged short', () => {
  const protocol = new Abridged();
  const payload = new Bytes(40);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.hex).toEqual(`0a${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].hex).toEqual(payload.hex);
  expect(unenveloped[0]).toBe('encrypted');
});

test('transport | abridged long', () => {
  const protocol = new Abridged();
  const payload = new Bytes(1032);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.hex).toEqual(`7f020100${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].hex).toEqual(payload.hex);
});

test('transport | abridged plain', () => {
  const protocol = new Abridged();
  const payload = new Bytes(52);

  payload.slice(8).randomize();

  const msg = new PlainMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.hex).toEqual(`0d${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[0]).toBe('plain');
});