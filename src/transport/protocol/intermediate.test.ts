import { Bytes } from '../../serialization';
import Intermediate from './intermediate';

test('transport | intermediate short', () => {
  const protocol = new Intermediate();
  const payload = new Bytes(40);
  payload.randomize();

  const enveloped = protocol.wrap(payload);
  expect(enveloped.hex).toEqual(`28000000${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);
  expect(unenveloped.hex).toEqual(payload.hex);
});

test('transport | intermediate long', () => {
  const protocol = new Intermediate();
  const payload = new Bytes(1032);
  payload.randomize();

  const enveloped = protocol.wrap(payload);
  expect(enveloped.hex).toEqual(`08040000${payload.hex}`);

  const unenveloped = protocol.unWrap(enveloped);
  expect(unenveloped.hex).toEqual(payload.hex);
});
