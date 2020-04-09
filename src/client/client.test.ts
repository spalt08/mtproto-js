import Client from './client';
import tl from '../mock/tl';
import configMock from '../mock/transport_config';
import { Socket } from '../transport';

test('Client | common', () => {
  const client = new Client(tl, {
    ...configMock,
    autoConnect: false,
  });

  expect(client.instances[0] instanceof Socket).toBeTruthy();
});
