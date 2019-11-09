import { Bytes } from '../../serialization';
import Obfuscation from './obfuscation';

test('transport | obfuscation', () => {
  const obf = new Obfuscation();

  const initpayload = obf.init('efefefef');

  expect(initpayload.length).toEqual(64);
  expect(initpayload.hex).not.toEqual(new Bytes(64).hex);


  // todo: check encryption
  // const payload = new Bytes(1032);
  // payload.randomize();

  // const obfuscated = obf.encode(payload);

  // expect(obfuscated.buffer).toEqual(obf.enc.encrypt(payload.buffer));

  // const deobfuscated = obf.decode(obf.dec.encrypt(payload.buffer));

  // expect(deobfuscated.buffer).toEqual(payload.buffer);
});
