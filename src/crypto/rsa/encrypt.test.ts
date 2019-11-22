/* eslint-disable max-len */
import encrypt from './encrypt';

test('rsa | encrypt', () => {
  const modulus = 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f'
  + '8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e5802'
  + '30e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b'
  + '8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d86'
  + '6b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b'
  + '6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083'
  + 'a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde7'
  + '4a5bfc920f6abf59ba5c75506373e7130f9042da922179251f';

  const exponent = '010001';

  const data = 'DB761C27718A2305044F71F2AD951629D78B2449';

  expect(encrypt(data, modulus, exponent)).toEqual('a4bd9732c5bf5fbf8d3bf55781f7d718a719d3cd4525ef80e9865963f1f48cdc44d8e3d4b508cc839d01f5b51c0724cc1ec70fbd738a4b6a2529cea0263133d9c5a7d6fccba118d62089d3d57b035a37fe083399c00570d10482e9daef324975eb4572a10bafe2eb77a8204301ea8d0411ff66b6cb8104c8f596f989f95f381e970b8eaf22a84d4379617197e14227afdf452a5e151d89b007177a4cef9b5d60d6c1da078568dc0b10ec4cdbfbab81b95c6f7f414c6ba099a8c2d650e0f38ab087518dc8bb922a61aa3593dd67f8cc28411588e728d83a9062b901b609073f11fa94ff2b8f9fd42d2892a5d5ffbe2825a1bb0b9263a5e1d53bff4f6e325d46f2');
});