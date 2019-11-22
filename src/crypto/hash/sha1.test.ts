/* eslint-disable max-len */

import sha1 from './sha1';
import { hex } from '../../serialization';

const cases = [
  ['', 'da39a3ee5e6b4b0d3255bfef95601890afd80709'],
  [hex('48656c6c6f20776f726c6421').raw, 'd3486ae9136e7856bc42212385ea797094475802'],
  ['94e723dc305f28b58ba1aba04e14aade037baa951234567812345678', '430f0f5df5eafe7007fd47b268e35011a5640afc'],
  ['Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.', 'e607a674e3c8454398a7d33a28268f44719af694'],
];

test('hash | sha1', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [input, out] = cases[i];
    expect(sha1(input).hex).toEqual(out);
  }
});
