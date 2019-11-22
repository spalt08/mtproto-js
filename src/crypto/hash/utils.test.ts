import { strToInt32, int32ToStr } from './utils';

const cases = [0, 1, 100, 132143214, 2434, -1];

test('hash | utils', () => {
  for (let i = 0; i < cases.length; i += 1) {
    expect(strToInt32(int32ToStr(cases[i]), 0)).toEqual(cases[i]);
  }
});
