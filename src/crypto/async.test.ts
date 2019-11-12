/* eslint-disable max-len */
import async from './async';
import { hex, Bytes } from '../serialization';
import { getPasswordKdf } from './async.tasks';

test('async | factorize task', () => {
  async('factorize', '17ED48941A08F981', (pq: string[]) => {
    expect(pq).toEqual(['494c553b', '53911073']);
  });
});

// todo: mock padding
// test('async | encrypt_pq task', () => {
//   const payloadPQ = [
//     hex('ec5ac983081e8c2086985161550000000453da7b1b000000045d426c4f0000002952501249fe86acd26bf3cd21a7f26a0a769a8f752ac700dff54d349c1e0c7828d1fbcba0fa7b13aae3b60ee79e203d1fc27d780c24706facd43d4a41090aca'),
//     {
//       fingerprint: 'a5b7f709355fc30b',
//       n: 'aeec36c8ffc109cb099624685b97815415657bd76d8c9c3e398103d7ad16c9bba6f525ed0412d7ae2c2de2b44e77d72cbf4b7438709a4e646a05c43427c7f184debf72947519680e651500890c6832796dd11f772c25ff8f576755afe055b0a3752c696eb7d8da0d8be1faf38c9bdd97ce0a77d3916230c4032167100edd0f9e7a3a9b602d04367b689536af0d64b613ccba7962939d3b57682beb6dae5b608130b2e52aca78ba023cf6ce806b1dc49c72cf928a7199d22e3d7ac84e47bc9427d0236945d10dbd15177bab413fbf0edfda09f014c7a7da088dde9759702ca760af2b8e4e97cc055c617bd74c3d97008635b98dc4d621b4891da9fb0473047927',
//       e: '010001',
//     },
//   ] as [Bytes, RSAKey];

//   async('encrypt_pq', payloadPQ, (encrypted: string) => {
//     expect(encrypted).toEqual('3c140e67b01e432ab3bdd5ab48883de212401e9801d9b61032b140b6be0920b147f0a220857d2f5c1227f9712853085f9683916fc535a823b6b86b0379b0f5dca756cddd125b4c4a999da1f2b2df1391895593e603375eba383db3e4897003f71e3fee3e2e3ac9dda0273dfcdb7a51aec9955fa21646292a7185ce5fd960750c174d534842ea2c2882fe6565afec742c8d8b6178457041a3f0474065a24da91f6fe6476e451cdc947e798a4cb86442361d35da2bb2c7140d87d54a75eb37d087751d84020efe4140709ecd4749b5af63153a3b3562ca5d1b6c77a8d2aa4b9299eac74f363878c2d0ff4d33c4aed121f2338f75d6a476b4c46d1d5e682dd95c18');
//   });
// });


test('async | decrypt_dh task', () => {
  const payloadPQ = [
    '8d1e7eb7425eea7d07cb783e0dd25abdd1bd6b365a4bc46bbd219012c1cb7654b06b0e2ffe0fd3c6ecedcd6bff9f3c7784c64544dcdb32d9b9201043701d19285558d3a6374979f10f89dee317c44c25cb330e85cb572096666d73a3b54a84ac17311769b4bf9c077b993c6db22b69f9dfabd50b2f74dd795fd8fabd3156cb2af10873661af350daf8c857c0738a63442446b1d375ed7b8ce3e8d86a47680f3bfd54a1c5dffaf8abda7fa1f2d34acdc4c46bad16e54b5d23bc507076fd4909fba6c805c8bae9e76331a91867c116a7f9c18ae244274860903f7bb41b9c3d98affa03bd72eca190c28183b4045c786559bf4850668d95666c07b73e36a06c6a58a73c28dca2c2693697d0d7973d1435b8dd03c3188b4675f1a1913b3365497d93055b496ea92473114ce1e51dd593c53713c49b1e1963f848cd39e3a21d7e3d32f756eb4ababe18f90f22fb03b1a918498ff66d7914c4a6b9053b04a747d44824a90343e7904f9be8adf8dd1569fdcdce49dfb3afb0c7fb8149b4182aa4b928b0b7c8de1976dd77df612e07616be5d1134cbba9685fbf1b083415814f87c3aa07cd526fde7793c765c11b370fba666b48810a4bcb1763deeafb6b61081d10c53eb6e2cdf9f28b9d0bbe427db06573b01ca4f193fc350e4ce3b9c7fec2823ccb2d8beddf4d56c53d8e2331e10ad73a33a54b310e0db2142910169931989cdbfd4d60ede67b1ff5596a1158cb661cddbb9069b484d15f1d90a627b5f98cdea66f20886453bda8b3f51311a2f1d3ad060e53c17b4d9b9f5890a172351e3984ff0d1daf8d3ae33d06cd31f014b07995731093',
    hex('f9afe711170dcc56fd4ef98d24893ddbf4666a91699d889f26d135e33f43c80c'),
    hex('92673272f6b6ffe5c6e46b31b0a1acb9'),
  ] as [string, Bytes, Bytes];

  async('decrypt_dh', payloadPQ, (encrypted: Bytes) => {
    expect(encrypted.hex).toEqual('c0fd2f01cb38d17325bbb8cbec83dba4efc51e3fba0d89b5becffa6b21c2cb89e8f2e678eaca2adf92673272f6b6ffe5c6e46b31b0a1acb903000000fe000100c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5bfe000100778e1f93735fdb98754b92bed351ea9db25c94c9cbb135b5212c29be1cf81e07b80cea64b998be5fd2af5b4e88e15746f2384545af4182bd74b0e977f0cfd091367004407befc6208402d008749f59e03696606900387175d995e895aea17a3a7d29e34ce9eb0da43718237390595cd9ec803a18b1afa065d6482c239e7142df9aa5bf090f00e21b57d4055175b748ec6668aecdc1c7f853f8c02f59764e058aa23ae6fa5e4d809298361d6dd52c6537c538a3957f91a6e9e2efb21c7a092e5a8d8baa7baa599d308f83f3945a931bfd68f31799b6c73a46bb2335fbdfa612b98992c88f60ad6192d77c9605c3db08c7ecc5a843f6cf83f90dc41eac9a76bd3b9dccc85d11217fb5d77e6d29');
  });
});

test('async | getPasswordKdf', () => {
  const salt1 = 'b6cb41e42a56054eb2e8320e30b215c0';
  const salt2 = 'f7951e1b4ac1d1ff6722d4adf1941577';
  const g = 3;
  const p = 'c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b';
  const srpId = '3541879028763065224';
  const srpB = '9ac2cd7f80945b9db27737553df8e4dacaa1cd1e18793dbc75d534311ec79a00234becae655b58ca5ef22a34d3898fb1819ca98c3d0daf93ec90ea1156a76522c8a53e94a103a9cc673325f1c3d620f9678c040f3c26c9c409158bea37b50053852c6c0831869d940b7e6909f200adfcd75d0b6fe9119262919909acf77f9abe0f68be3aaa5c6abcb3a7115f65501fb4ebcf3f49506e00f92c335a5b3b827740541b4666dd9ee6645419abfda67af46b34959e401082fc0a8e7264c0ceedfcbc0c8a723671294e052ca0edcddc9a6bc9f5e8b48867d04f3b122883228680946aa9cbcb0a3fea6e618e5099062e36ca9911846156e99f5b2c03b41de3de2c9539';
  const rand = '9153faef8f2bb6da91f6e5bc96bc00860a530a572a0f45aac0842b4602d711f8bda8d59fb53705e4ae3e31a3c4f0681955425f224297b8e9efd898fec22046debb7ba8a0bcf2be1ada7b100424ea318fdcef6ccfe6d7ab7d978c0eb76a807d4ab200eb767a22de0d828bc53f42c5a35c2df6e6ceeef9a3487aae8e9ef2271f2f6742e83b8211161fb1a0e037491ab2c2c73ad63c8bd1d739de1b523fe8d461270cedcf240de8da75f31be4933576532955041dc5770c18d3e75d0b357df9da4a5c8726d4fced87d15752400883dc57fa1937ac17608c5446c4774dcd123676d683ce3a1ab9f7e020ca52faafc99969822717c8e07ea383d5fb1a007ba0d170cb';

  const res = getPasswordKdf(salt1, salt2, g, p, srpId, srpB, 'pas', rand);

  expect(res.srp_id).toBe('3541879028763065224');
  expect(res.A).toBe('5327bf0e6b28d0757fa2ab239caf742c72689095c5dcef0f5429e51a3ca42999aa9b482e720fd9a24be9931aa541060df2f08006d9c4ec587a434d87ab2a5ef61d45e9793957e6d0deaf0c791ebaef55d9f9c1f4ecfc8d57266c459704805ea92437cd839dc8208ce9fab52bf9bd6140e82783b52cc9b632cc3c7a5f356b25281114fccbcff43bb799a6cdd6f668753c26a35f9455186875ad46b045e48905a0a0c9c8f564fa998060d8f3db49769213b049e04ad830750e505d1ecbdacd5bd32091f65919b8a085e3315efca2e1a5eb41a41defbb63ed39c46c99197f44c53b01124bddabf1f6982457f53dc9d3477a6eb745046c709520825c571a63b7dfa1');
  expect(res.M1).toBe('8647f0c3814dcba9fce53ba40d87920880a413eddccc5995a289f6e08c21512c');
});
