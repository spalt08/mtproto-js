/* eslint-disable max-len */
import client from '../mock/client';
import RPCService from './rpc';
import { Message } from '../message';

test('rpc service | common', () => {
  const service = new RPCService(client);
  const id = '51e57ac42770964a';
  const msg = new Message(client.tl.create('help.getNearestDc'));
  let fetched = false;
  msg.id = id;

  service.subscribe(msg, 1, 1, 'websocket', (err, result) => {
    fetched = true;

    if (err || !result) throw new Error('Expected result');
    expect(result._).toBe('nearestDc');
  });

  const result = client.tl.create('rpc_result', {
    req_msg_id: id,
    result: {
      _: 'nearestDc',
      country: 'ru',
      this_dc: 1,
      nearest_dc: 1,
    },
  });

  result.serialize();

  service.processMessage(result, {
    dc: 1,
    thread: 1,
    id: '51E57AC91E83C801',
    transport: 'websocket',
  });

  expect(fetched).toBeTruthy();
  expect(service.requests).toStrictEqual({});
});
