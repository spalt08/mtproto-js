/* eslint-disable max-len */

import sha256 from './sha256';
import { hex, Bytes } from '../../serialization';

const cases = [
  ['', hex('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')],
  [hex('48656c6c6f20776f726c6421').raw, hex('c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a')],
  ['Hello world!', hex('c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a')],
  ['305436bf889314e4a3faec05ecffcbb7df31ad9e51f1312233123df1', hex('277b8bfc3330dffeab6b28dcfaab0d0c691e32e3069a32b35b7c692091e60808')],
  ['Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.', hex('e68fe78e064700fe6b98e47dc0758a4f966bd027299b685642c607ea376b7d47')],
];

test('hash | sha256', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [input, out] = cases[i]as [string, Bytes];
    const res = sha256(input);

    expect(res.length).toEqual(32);
    expect(res.hex).toEqual(out.hex);
  }
});
