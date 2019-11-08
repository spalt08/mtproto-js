/* eslint-disable max-len */
import TLBytes from './bytes';
import { hex, Bytes } from '../serialization';

const cases = [
  ['string', 'Test case #1', 1, hex('000c546573742063617365202331000000')],
  ['bytes', 'ff00ff01', 3, hex('00000004ff00ff01000000')],
  [
    'string',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue dictum enim eget convallis. Quisque imperdiet convallis risus nec venenatis. Sed aliquet pharetra porttitor. Curabitur efficitur iaculis tortor et lacinia. Aenean convallis ipsum commodo elementum porta. Class aptent taciti posuere.',
    0,
    hex('fe2c01004c6f72656d20697073756d20646f6c6f722073697420616d65742c20636f6e73656374657475722061646970697363696e6720656c69742e2053656420636f6e6775652064696374756d20656e696d206567657420636f6e76616c6c69732e205175697371756520696d7065726469657420636f6e76616c6c6973207269737573206e65632076656e656e617469732e2053656420616c697175657420706861726574726120706f72747469746f722e204375726162697475722065666669636974757220696163756c697320746f72746f72206574206c6163696e69612e2041656e65616e20636f6e76616c6c697320697073756d20636f6d6d6f646f20656c656d656e74756d20706f7274612e20436c61737320617074656e742074616369746920706f73756572652e'),
  ],
];

test('TLBytes | read', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [type, res, offset, bytes] = cases[i];

    const tl = new TLBytes(type as string);
    tl.read(bytes as Bytes, offset as number);

    expect(tl.value).toEqual(res);
  }
});


test('TLBytes | write', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [type, res, offset, bytes] = cases[i];

    const empty = new Bytes((bytes as Bytes).length);

    const tl = new TLBytes(type as string, res as string);
    tl.write(empty, offset as number);

    expect(empty.buffer).toEqual((bytes as Bytes).buffer);
  }
});
