
import Transport from './abstract';
import configMock from '../mock/transport_config';
import { PlainMessage } from '../message';

test('Transport | constructor', () => {
  const tr = new Transport(() => {}, configMock);

  expect(tr.cfg.dc).toEqual(configMock.dc);
  expect(tr.cfg.thread).toEqual(configMock.thread);

  let raised = 0;

  try {
    tr.send(new PlainMessage(new Uint32Array(10)));
  } catch (e) {
    expect(e.message.length).toBeGreaterThan(0);
    raised++;
  }

  expect(raised).toBe(1);
});
