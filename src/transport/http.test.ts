import Http from './http';
import { TypeLanguage } from '..';
import { hex } from '../serialization';
import { DCService } from '../client';
import { PlainMessage, Message } from '../message';

test('Transort | http plain call', () => {
  const tl = new TypeLanguage();
  const nonce = hex('3E0549828CCA27E966B301A48FECE2FC').uint;
  const query = tl.create('req_pq', { nonce });
  const msg = new PlainMessage(query.serialize());


  const resolve = (_dc: number, _thread: number, res?: PlainMessage | Message) => {
    if (res instanceof PlainMessage) {
      expect(tl.parse(res.data).json().nonce).toEqual(nonce);
    } else throw new Error('FAIL');
  };

  const http = new Http(new DCService(), {
    test: true, ssl: true, dc: 1, thread: 1, resolve,
  });


  http.send(msg);
});
