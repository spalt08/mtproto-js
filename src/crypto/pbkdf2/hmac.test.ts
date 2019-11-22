/* eslint-disable max-len */

import hmac from './hmac';
import { hex } from '../../serialization';

const cases = [
  ['', hex('123456').raw, 'e2f94bc6e2b4dc562eb7394688d6e05aab03aec2eba653c28d21e51840d7d48207f667e8280d9ac896eac36f91e6a264278cdb95e7d3d5337cfc9edd7d611aaa'],
  ['Hello World!', hex('63727970746969').raw, '5e58f6be8eaeb109a73041bfe4c62eeacb5ff11cb23e76e6957ddf83fcd524c6a0f32eab9a04d8ac789e5fbe2f50ecf6785079614619f055b5c359b433b8e0b7'],
  ['test', hex('80dc4462bab9029ef9e9c68bd9056c9865bdd229b721f0499e8a3b49babb71140abe745061acaefdd79e14b8abcd8e5f1a6cdf6e3916f2cb2037062e4c597f2a80dc4462bab9029ef9e9c68bd9056c9865bdd229b721f0499e8a3b49babb71140abe745061acaefdd79e14b8abcd8e5f1a6cdf6e3916f2cb2037062e4c597f2a').raw, '7bc3662011b0cd84167709ce223a9cd4b8551c05d35f6aafdef56b966d856e350b81e2fcb2f3a4873b9f54eb7521f98bffeda0b9d4029a330782c7b0cd0a1e57'],
];

test('hmac | basic', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [input, key, out] = cases[i];
    expect(hmac(input, key).hex).toEqual(out);
  }
});
