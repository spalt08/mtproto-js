import Client from './client';
import tl from '../mock/tl';
import configMock from '../mock/transport_config';
import { Socket } from '../transport';
import { randomize } from '../serialization';
import { ResPQ } from '../tl/layer105/types';

test('Client | common', () => {
  const client = new Client(tl, {
    ...configMock,
    autoConnect: false,
    transport: 'websocket',
  });

  expect(client.instances[0] instanceof Socket).toBeTruthy();

  const nonce = new Uint32Array(4);
  randomize(nonce);

  const async = new Promise<ResPQ.resPQ>((resolve) => {
    client.plainCall({ _: 'req_pq', nonce }, (err, result) => {
      expect(err).toBe(null);
      resolve(result);
    });
  });

  return async.then((result) => {
    expect(result._).toEqual('resPQ');
    expect(result.nonce).toEqual(nonce);
  });
});