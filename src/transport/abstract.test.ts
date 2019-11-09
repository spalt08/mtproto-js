import Transport from './abstract';
import { TypeLanguage } from '..';

test('Transort | constructor', () => {
  const tl = new TypeLanguage();
  const tr = new Transport(tl, { APILayer: 1 });

  expect(tr.tl).toEqual(tl);
  expect(tr.APILayer).toEqual(1);
});
