/* eslint-disable max-len */

import TypeLanguage from './tl';
import { hex } from '../serialization';
import { TLConstructor } from '.';

const tl = new TypeLanguage();

// const case = {
//   formula: 'resPQ',
//   value: {
//     _: 'resPQ',
//     nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
//     server_nonce: hex('A5CF4D33F4A11EA877BA4AA573907330').uint,
//     pq: '17ed48941a08f981',
//     server_public_key_fingerprints: [
//       hex('216BE86C022BB4C3').uint,
//     ],
//   },
//   isBare: false,
//   offset: 0,
//   serialized: hex('632416053E0549828CCA27E966B301A48FECE2FCA5CF4D33F4A11EA877BA4AA5739073300817ED48941A08F98100000015C4B51C01000000216BE86C022BB4C3'),
// };

test('TypeLanguage | create', () => {
  const q = tl.create('req_pq', {
    nonce: hex('3E0549828CCA27E966B301A48FECE2FC').uint,
  });

  expect(q instanceof TLConstructor).toEqual(true);
  expect(q._).toEqual('req_pq');
  expect(q.params.nonce.value).toEqual(hex('3E0549828CCA27E966B301A48FECE2FC').uint);
});


test('TypeLanguage | parse', () => {
  const data = hex('632416053E0549828CCA27E966B301A48FECE2FCA5CF4D33F4A11EA877BA4AA5739073300817ED48941A08F98100000015C4B51C01000000216BE86C022BB4C3');

  const res = tl.parse(data);

  expect(res._).toEqual('resPQ');
  expect(res instanceof TLConstructor).toEqual(true);

  if (res instanceof TLConstructor) {
    expect(res.params.nonce.value).toEqual(hex('3E0549828CCA27E966B301A48FECE2FC').uint);
    expect(res.params.server_nonce.value).toEqual(hex('A5CF4D33F4A11EA877BA4AA573907330').uint);
    expect(res.params.pq.value).toEqual('17ed48941a08f981');
    expect(res.params.server_public_key_fingerprints.value).toEqual([hex('216BE86C022BB4C3').uint]);
  } else throw new Error('expected constructor');
});
