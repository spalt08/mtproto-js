
import Transport from './abstract';
import configMock from '../mock/transport_config';

test('Transort | constructor', () => {
  const tr = new Transport(() => {}, configMock);

  expect(tr.cfg.dc).toEqual(configMock.dc);
  expect(tr.cfg.thread).toEqual(configMock.thread);
});
