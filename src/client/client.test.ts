import Client from './client';
import configMock from '../mock/transport_config';
import { Socket, Http } from '../transport';
import { randomize } from '../serialization';
import { ResPQ } from '../tl/layer105/types';

test('Client | common', () => {
  const client = new Client({
    ...configMock,
    meta: {},
    autoConnect: false,
    transport: 'websocket',
  });

  expect(client.instances[0] instanceof Socket).toBeTruthy();

  const nonce = new Uint32Array(4);
  randomize(nonce);

  let connected = false;
  let metaChanged = false;
  client.on('networkChanged', (state) => { connected = state === 'connected'; });
  client.on('metaChanged', () => { metaChanged = true; });
  client.dc.setMeta(1, 'salt', '0102030405060708');

  const async = new Promise<ResPQ.resPQ>((resolve) => {
    client.plainCall('req_pq', { nonce }, (err, result) => {
      expect(err).toBe(null);
      expect(connected).toBeTruthy();
      expect(metaChanged).toBeTruthy();
      resolve(result);
    });
  });

  return async.then((result) => {
    expect(result._).toEqual('resPQ');
    expect(result.nonce).toEqual(nonce);
  });
});

test('Client | http', () => {
  const client = new Client({
    ...configMock,
    meta: {},
    autoConnect: false,
    transport: 'http',
  });

  expect(client.instances[0] instanceof Http).toBeTruthy();
});
