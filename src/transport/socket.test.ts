// import Socket from './socket';
// import { TypeLanguage } from '..';
// import { hex } from '../serialization';
// import { TranportError } from './abstract';
// import { TLAbstract, TLConstructor } from '../tl';

// test('Transort | socket plain call', () => {
//   const tl = new TypeLanguage();
//   const nonce = hex('3E0549828CCA27E966B301A48FECE2FC').uint;
//   const socket = new Socket(tl, { APILayer: 105 });

//   socket.on('ready', () => {
//     socket.plainCall('req_pq', { nonce }, (error: TranportError | null, result?: TLAbstract) => {
//       expect(error).toEqual(null);

//       if (result instanceof TLConstructor) {
//         expect(result.json().nonce).toEqual(nonce);
//       } else throw new Error('FAIL');
//     });
//   });
// });
