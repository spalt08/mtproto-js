import { Bytes } from '../../serialization';
import Full from './full';
import crc32 from '../../utils/crc32';

test('transport | full', () => {
  const protocol = new Full();
  const payload = new Bytes(40);
  payload.randomize();

  const enveloped = protocol.wrap(payload);

  expect(enveloped.slice(0, 4).int32).toEqual(payload.length + 12);
  expect(enveloped.slice(4, 8).int32).toEqual(0);
  expect(enveloped.slice(8, 8 + payload.length).hex).toEqual(payload.hex);
  expect(enveloped.slice(8 + payload.length).hex).toEqual(`0${crc32(enveloped.slice(0, 8 + payload.length).raw).toString(16)}`.slice(-8));

  const unenveloped = protocol.unWrap(enveloped);
  expect(unenveloped.hex).toEqual(payload.hex);

  const envelopedNext = protocol.wrap(payload);
  expect(envelopedNext.slice(4, 8).int32).toEqual(1);
});
