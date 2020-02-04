import { Bytes } from '../../serialization';
import Abridged from './abridged';

test('transport | abridged short', () => {
  const protocol = new Abridged();
  const payload = new Bytes(40);

  payload.randomize();

  const enveloped = protocol.wrap(payload);
  expect(enveloped.hex).toEqual(`0a${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);
  expect(unenveloped.hex).toBe(payload.hex);
});

test('transport | abridged long', () => {
  const protocol = new Abridged();
  const payload = new Bytes(1032);

  payload.randomize();

  const enveloped = protocol.wrap(payload);

  expect(enveloped.hex).toEqual(`7f020100${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);
  expect(unenveloped.hex).toEqual(payload.hex);
});
