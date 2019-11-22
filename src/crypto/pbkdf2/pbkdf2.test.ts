/* eslint-disable max-len */
import pbkdf2 from './pbkdf2';

const cases = [
  ['Test', 'Hallo', 1000, 64, '217ba952da0c37f51a31fc2decc0b6f0661c36b264795dde323933beea8ee3eab3fb1747c779cb9fea529b44cc9d21a323d821474e3b950e1fe780ce8daae14f'],
  ['Testdsdsfsdds', 'Hallodsds', 100, 32, 'd2f263523575927af455d809031ea95c45f302731295eef253232a33baa5fcaf'],
  ['Testdsdsfsddsdsfsdsdfsf', 'Hallodsds34424232dsfsdfsdfefwerwerr', 100000, 64, 'c91489deeae689bd09c141d67bd3af5186098b4d8012e774bee7cc380a1ee37d5534a6ab4c554b06f282e3f88b3c0cbc914716a499035e653ad7f9d2f24732ee'],
];

test('pbkdf2 | basic', () => {
  for (let i = 0; i < cases.length; i += 1) {
    const [pwd, salt, iter, dklen, res] = cases[i] as any[];
    expect(pbkdf2(pwd, salt, iter, dklen).hex).toEqual(res);
  }
});
