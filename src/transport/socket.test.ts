import Socket from './socket';
import { TypeLanguage } from '..';
import { hex } from '../serialization';
import { PlainMessage } from '../message';
import configMock from '../mock/transport_config';
import { TransportCallback } from './abstract';

test('Transort | socket plain call', () => {
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

  const socket = new Socket(receiver, {
    ...configMock,
    protocol: 'intermediate',
  });

  socket.send(msg);
});
