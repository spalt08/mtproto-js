import PlainMessage from './plain';
import TLConstructor from '../tl/constructor';
import { SchemaProvider } from '../schema';
import { hex } from '../serialization';

test('message | plain create', () => {
  const tl = new TLConstructor('req_pq#60469778 nonce:int128 = ResPQ', new SchemaProvider(), false, {
    nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
  });

  const msg = new PlainMessage(tl);
  msg.id = '51e57ac42770964a';

  expect(msg.buf.hex).toEqual('00000000000000004A967027C47AE55114000000789746603E0549828CCA27E966B301A48FECE2FC'.toLowerCase());
});
