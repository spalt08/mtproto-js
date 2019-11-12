
import { DCService } from '../client';
import Transport from './abstract';

test('Transort | constructor', () => {
  const tr = new Transport(new DCService(), {
    test: true, ssl: true, dc: 1, thread: 1, resolve: () => {}, resolveError: () => {},
  });

  expect(tr.cfg.dc).toEqual(1);
  expect(tr.cfg.thread).toEqual(1);
});
