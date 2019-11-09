import Http from './http';
import { TypeLanguage } from '..';
import { hex } from '../serialization';
import { TranportError } from './abstract';
import { TLAbstract, TLConstructor } from '../tl';

test('Transort | constructor', () => {
  const tl = new TypeLanguage();
  const nonce = hex('3E0549828CCA27E966B301A48FECE2FC').uint;
  const http = new Http(tl, { APILayer: 105 });

  http.plainCall('req_pq', { nonce }, (error: TranportError | null, result?: TLAbstract) => {
    expect(error).toEqual(null);

    if (result instanceof TLConstructor) {
      expect(result.json().nonce).toEqual(nonce);
    } else throw new Error('FAIL');
  });
});
