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

test('TLBytes | check length', () => {
  const data = '42165fbad4e30d745fcd950fcff93f550c44e0d6cc27d2a0f15f900a0bb7a6eeed7d3f30e9dc41fd3c9ccb3cc3332b372dde2c9a1f190fc78e0cb8c5043c946da3b67d7e81eafb2e016a2dfeea863905f112e4eb12c2d13796f38afde676b419147bdb27c60dc5c80f121abbbae841f2d933577178d50c1e85bcb5f559a3a804b51174272d4ff01f1910f1e20ad1e9eeefe238d135b544cc71aedf4d57d3caadd20ac8e24256d1b4b0646a01bf4a1e59bf858ef38c49d354522155735da73234579dc34784b7f380c22b378f09a90361438a212ed1647af4ac8abd78efc8e574049a03c518776fcdeb4edf2b8e62c8605e9a57f4f4f3eb87f6a8dac012d4100';
  const tl = new TLBytes('bytes', data);

  const empty = new Bytes(260);
  tl.write(empty, 0);

  expect(empty.slice(0, 4).hex).toBe('fe000100');
  expect(empty.slice(4, 260).hex).toBe(`0${data}`);
});
