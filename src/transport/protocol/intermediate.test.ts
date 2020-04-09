import { randomize } from '../../serialization';
import { wrap, unWrap } from './intermediate';

test('transport | intermediate', () => {
  const payload = new Uint32Array(10);
  randomize(payload);

  const enveloped = wrap(payload);
  expect(enveloped[0]).toEqual(0x28000000);
  expect(enveloped.subarray(1)).toEqual(payload);

  const unenveloped = unWrap(enveloped);
  expect(unenveloped).toEqual(payload);
});

test('transport | intermediate long', () => {
  const payload = new Uint32Array(258);
  randomize(payload);

  const enveloped = wrap(payload);
  expect(enveloped[0]).toEqual(0x08040000);
  expect(enveloped.subarray(1)).toEqual(payload);

  const unenveloped = unWrap(enveloped);
  expect(unenveloped).toEqual(payload);
});
