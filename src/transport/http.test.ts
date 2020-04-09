import Http from './http';
import configMock from '../mock/transport_config';
import { PlainMessage, ErrorMessage } from '../message';
import { TransportCallback } from './abstract';
import plainMock from '../mock/message_plain';

test('Transport | http plain call', () => {
  const async = new Promise<PlainMessage>((resolve) => {
    const receiver: TransportCallback = (cfg, message) => {
      if (!(message instanceof PlainMessage)) throw new Error('Should receive plain message');

      expect(cfg).toBe(configMock);
      expect(message instanceof PlainMessage).toBeTruthy();

      resolve(message);
    };

    const http = new Http(receiver, configMock);
    http.send(plainMock);
  });

  return async.then((message) => {
    expect(message.nonce).toEqual(plainMock.nonce);
  });
});

test('Transport | http plain error', () => {
  const async = new Promise<ErrorMessage>((resolve) => {
    const errMsg = new PlainMessage(plainMock.buf.slice(0));

    errMsg.buf[0] = 0xFF;

    const receiver: TransportCallback = (cfg, message) => {
      expect(cfg).toBe(configMock);
      resolve(message as ErrorMessage);
    };

    const http = new Http(receiver, configMock);
    http.send(errMsg);
  });

  return async.then((message) => {
    expect(message instanceof ErrorMessage).toBeTruthy();
  });
});
