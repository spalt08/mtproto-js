import Http from './http';
import { TypeLanguage } from '..';
import { hex } from '../serialization';
import configMock from '../mock/transport_config';
import { PlainMessage } from '../message';
import { TransportCallback } from './abstract';

test('Transort | http plain call', () => {
  const tl = new TypeLanguage();
  const nonce = hex('3E0549828CCA27E966B301A48FECE2FC').uint;
  const query = tl.create('req_pq', { nonce });
  const msg = new PlainMessage(query);

  const receiver: TransportCallback = (cfg, message) => {
    if (!(message instanceof PlainMessage)) throw new Error('Should receive plain message');

    expect(cfg).toBe(configMock);
    expect(message instanceof PlainMessage).toBeTruthy();
    expect(message.nonce).toBe(nonce);
  };

  const http = new Http(receiver, configMock);

  http.send(msg);
});
