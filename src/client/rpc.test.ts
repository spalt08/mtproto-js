/* eslint-disable max-len */
import client from '../mock/client';
import RPCService from './rpc';
import { Message } from '../message';
import { build } from '../tl';

test('rpc service | common', () => {
  const service = new RPCService(client);
  let raised = 0;

  const id = '51e57ac42770964a';
  const dc = 1;
  const thread = 1;
  const transport = 'websocket';
  const msg = new Message(build({ _: 'help.getNearestDc' }), true);
  msg.id = id;

  // listen server answer
  service.subscribe(msg, dc, thread, transport, (err, result) => {
    raised++;

    if (err || !result) throw new Error('Expected result');
    expect(result._).toBe('nearestDc');
  });

  // emulate response
  const result = {
    _: 'rpc_result',
    req_msg_id: id,
    result: {
      _: 'nearestDc',
      country: 'ru',
      this_dc: 1,
      nearest_dc: 1,
    },
  };

  service.processMessage(result, {
    dc: 1,
    thread: 1,
    id: '51E57AC91E83C801',
    transport: 'websocket',
  });

  expect(raised).toBe(1);
  expect(service.requests).toStrictEqual({});
});
