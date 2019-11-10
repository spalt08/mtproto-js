import { EncryptedMessage, PlainMessage } from '../../message';
import { Bytes } from '../../serialization';
import IntermediatePadded from './intermediate_padded';

test('transport | intermediate padded short', () => {
  const protocol = new IntermediatePadded();
  const payload = new Bytes(40);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.slice(0, 4).int32).toBeGreaterThanOrEqual(payload.length);
  expect(enveloped.slice(0, 4).int32).toBeLessThan(payload.length + 16);
  expect(enveloped.slice(4, 4 + payload.length).hex).toEqual(payload.hex);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].slice(0, payload.length).hex).toEqual(payload.hex);
  expect(unenveloped[0]).toBe('encrypted');
});

test('transport | intermediate padded long', () => {
  const protocol = new IntermediatePadded();
  const payload = new Bytes(1032);

  payload.randomize();

  const msg = new EncryptedMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.slice(0, 4).int32).toBeGreaterThanOrEqual(payload.length);
  expect(enveloped.slice(0, 4).int32).toBeLessThan(payload.length + 16);
  expect(enveloped.slice(4, 4 + payload.length).hex).toEqual(payload.hex);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[1].slice(0, payload.length).hex).toEqual(payload.hex);
});

test('transport | intermediate paddded plain', () => {
  const protocol = new IntermediatePadded();
  const payload = new Bytes(52);

  payload.slice(8).randomize();

  const msg = new PlainMessage(payload);
  const enveloped = protocol.wrap(msg.buf);

  expect(enveloped.slice(0, 4).int32).toBeGreaterThanOrEqual(payload.length);
  expect(enveloped.slice(0, 4).int32).toBeLessThan(payload.length + 16);
  expect(enveloped.slice(4, 4 + payload.length).hex).toEqual(payload.hex);

  const unenveloped = protocol.unWrap(enveloped);

  expect(unenveloped[0]).toBe('plain');
});
