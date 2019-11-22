/* eslint-disable max-len */

import sha512 from './sha512';

const cases = [
  ['', 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'],
  ['Hello world!', 'f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6'],
  ['Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.', '425286c1dc4db148139bd3c2adda330677f43e5e0505ef703f7802986d946d4e59306e537aaa22a257f78ee954060cbab059b429e16a0177252f1d30108c9eb6'],
];

test('hash | sha512', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [input, out] = cases[i];
    expect(sha512(input).hex).toEqual(out);
  }
});
