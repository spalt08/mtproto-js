// @flow

import { logs } from './utils/log';
import { MessagePlain, MessageData, MessageEncrypted } from './serialization';
import { encryptDataMessage, decryptDataMessage } from './crypto/aes/message';
import Hex from './serialization/hex';
import GenericBuffer from './serialization/genericBuffer';
import HexDump from './utils/hexdump';

export default async function Test(transport, tl): string {
  const salt = 'f3b4d6e2e91c724a';
  const sessionID = '00000123223d7a1c';
  const authKey = new Hex('6d5ff11d920ecae2151a5f2a888368a1322d06ce183959d4e89178eb65169ac210831da04b43fa691c53b089dcc569704aaec7a6ed1d30ceb58ebd9b71f317e21651ac5d1b5dce7c1266d807a22ea31a231b7a6eb89f741fd3e90a15e157f1c39cde3836efc357ef2080296433ec98658f26daaea4484c16e5181da444e5d1b08dad06e443bb2041e8755a7f94dd868d6f6d5b1e938384bb33d63780553d8d845e9ad6665325f8f93cb850744565805418f10b9010c21f2cde6dd667568f43da67059e09608c98889cb6abf6318a998e0e2ddfa30b7cf606f9cd31808384cc5c1a421a5222bceba8b0e9f4ac616e5b4decba805c39a2f18033e9d9e0c87d19ff');


  // const query = tl.construct('req_pq_multi#be7e8ef1 nonce:int128 = ResPQ').randomize('nonce');
  // const msg = new MessagePlain(query.serialize());
  
  // msg.setMessageID();
  // msg.setLength();

  // console.log(msg.dump());

  // const reqpq = new MessagePlain(await transport.call(msg.buf));
  
  // console.log(reqpq.dump());

  // const res = tl.parse(reqpq);

  // window.res = res;

 // window.c = tl.parse(message);

  //console.log(message.dump());

  tl.schema.define('dcOption#2ec2a43c id:int hostname:string ip_address:string port:int = DcOption;');
  tl.schema.define('config#232d5905 date:int test_mode:Bool this_dc:int dc_options:Vector<DcOption> chat_size_max:int = Config;');
  
  const message = new MessageData(4);
  message.view.setNumber(0xC4F9186B, 32, 4);

  message.setSalt(salt);
  message.setSessionID(sessionID);
  message.setMessageID();
  message.setSequenceNum(1);
  message.setLength();
  message.setPadding();

  console.log(message.dump());

  const encrypted = encryptDataMessage(authKey, message);

  console.log(encrypted.dump());

  const resMsg = await transport.call(encrypted.buf);
  const decrypted = decryptDataMessage(authKey, new MessageEncrypted(resMsg));

  window.d = decrypted;
  console.log(decrypted.dump());

  const res = tl.parse(decrypted);

  window.res = res;


  // // console.log(encrypt(
  // //   new Hex('99706487A1CDE613BC6DE0B6F24B1C7AA448C8B9C3403E3467A8CAD89340F53B'),
  // //   new Hex('5468697320697320616E20696D706C65'),
  // //   new Hex('6D656E746174696F6E206F6620494745206D6F646520666F72204F70656E5353'),
  // // ));

  // // const req = tl.construct('help.getConfig');

  // // logs('test', 'prepared req');

  // const decrypted = decryptDataMessage(authKey, new MessageEncrypted(resMsg.buf));

  // console.log(decrypted);
  // console.log(decrypted.dump());
  // console.log(decrypted.view.getNumber(32, 4));

  // window.d = decrypted;

  
  // logs('auth', 'got res', res);
}
