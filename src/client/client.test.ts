import Client from './client';
import configMock from '../mock/transport_config';
import { Socket, Http } from '../transport';
import { randomize } from '../serialization';
import { ResPQ } from '../tl/mtproto/types';
import metaMock from '../mock/client_meta';
import { AuthKey } from './types';

test('client | common', () => {
  const client = new Client({
    ...configMock,
    meta: metaMock,
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
  client.dc.setSalt(1, '0102030405060708');

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

test('client | http', () => {
  const client = new Client({
    ...configMock,
    meta: metaMock,
    autoConnect: false,
    transport: 'http',
  });

  expect(client.instances[0] instanceof Http).toBeTruthy();
});

test('client | authorization no-pfs', () => {
  const client = new Client({
    ...configMock,
    meta: {
      ...metaMock,
      pfs: false,
    },
    autoConnect: false,
  });

  const async = new Promise<AuthKey>((resolve) => {
    client.authorize(1, resolve);
  });

  return async.then((key) => {
    if (!key) throw new Error('key should be null');
    expect(key.id.length).toEqual(16);
    expect(key.key.length).toEqual(64);
    expect(!key.expires).toEqual(true);
    expect(client.dc.pfs()).toEqual(false);
  });
}, 150000);

test('client | authorization pfs', () => {
  const client = new Client({
    ...configMock,
    meta: metaMock,
    autoConnect: false,
  });

  const async = new Promise<AuthKey>((resolve) => {
    client.authorize(1, resolve);
  });

  return async.then((key) => {
    if (!key) throw new Error('key should be null');
    expect(key.id.length).toEqual(16);
    expect(key.key.length).toEqual(64);
  });
}, 150000);
