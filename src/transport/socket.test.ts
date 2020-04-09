import Socket from './socket';
import { PlainMessage } from '../message';
import configMock from '../mock/transport_config';
import { TransportCallback } from './abstract';
import plainMock from '../mock/message_plain';

test('Transport | socket plain call', () => {
  const async = new Promise<PlainMessage>((resolve) => {
    const receiver: TransportCallback = (cfg, message) => {
      if (typeof message === 'string') return; // skip service messages

      if (!(message instanceof PlainMessage)) throw new Error('Should receive plain message');

      expect(cfg).toBe(configMock);
      expect(message instanceof PlainMessage).toBeTruthy();

      resolve(message);
    };

    const socket = new Socket(receiver, configMock);
    socket.send(plainMock);
  });

  return async.then((message) => {
    expect(message.nonce).toEqual(plainMock.nonce);
  });
});
