import { genPasswordSRP } from './srp';
import { salt1, salt2, g, p, srpId, rand, srpB, password, A, M1 } from '../mock/srp';

test('async | getPasswordKdf', () => {
  const res = genPasswordSRP(salt1, salt2, g, p, srpId, srpB, password, rand);

  expect(res.srp_id).toEqual(srpId);
  expect(res.A).toEqual(A);
  expect(res.M1).toEqual(M1);
});
