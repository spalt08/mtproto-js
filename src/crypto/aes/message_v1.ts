// @flow

import { MessageData, MessageEncrypted, Hex } from '../../serialization';
import SHA1 from '../sha1';
import encrypt from './encrypt';
import decrypt from './decrypt';

/**
 * MTProto v1.0
 * Encrypts MessageData object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description_v1
 *
 * @param {Hex} authKey Auth Key
 * @param {MessageData} msg Unencrypted Message
 * @returns {MessageEncrypted} Encrypted Message
 */
export function encryptDataMessage(authKey: {key: Hex, id: Hex}, msg: MessageData): MessageEncrypted {
  const data = msg.toHex();

  const msgKey = SHA1.Hex(data.sliceBytes(0, msg.bytePaddingBefore + msg.payloadLength)).sliceBytes(4, 20);
  const sha1a = SHA1.Hex(Hex.concat(msgKey, authKey.key.sliceBytes(0, 32)));
  const sha1b = SHA1.Hex(Hex.concat(authKey.key.sliceBytes(32, 48), msgKey, authKey.key.sliceBytes(48, 64)));
  const sha1c = SHA1.Hex(Hex.concat(authKey.key.sliceBytes(64, 96), msgKey));
  const sha1d = SHA1.Hex(Hex.concat(msgKey, authKey.key.sliceBytes(96, 128)));
  const aesKey = Hex.concat(sha1a.sliceBytes(0, 8), sha1b.sliceBytes(8, 20), sha1c.sliceBytes(4, 16));
  const aesIv = Hex.concat(sha1a.sliceBytes(8, 20), sha1b.sliceBytes(0, 8), sha1c.sliceBytes(16, 20), sha1d.sliceBytes(0, 8));

  const encryptedData = encrypt(data, aesKey, aesIv);

  const encMsg = new MessageEncrypted(encryptedData.byteLength);

  encMsg.setAuthKey(authKey.id);
  encMsg.setMsgKey(msgKey);
  encMsg.setData(encryptedData);

  return encMsg;
}

/**
 * MTProto v1.0
 * Decrypts MessageEncrypted object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description_v1
 *
 * @param {Hex} authKey Auth Key
 * @param {MessageEncrypted} msg Encrypted Message
 * @returns {MessageData} Unencrypted Message
 */
export function decryptDataMessage(authKey: {key: Hex, id: Hex}, msg: MessageEncrypted): MessageData {
  const data = msg.getData();
  const msgKey = msg.getMsgKey();
  const sha1a = SHA1.Hex(Hex.concat(msgKey, authKey.key.sliceBytes(8, 40)));
  const sha1b = SHA1.Hex(Hex.concat(authKey.key.sliceBytes(40, 56), msgKey, authKey.key.sliceBytes(56, 72)));
  const sha1c = SHA1.Hex(Hex.concat(authKey.key.sliceBytes(72, 104), msgKey));
  const sha1d = SHA1.Hex(Hex.concat(msgKey, authKey.key.sliceBytes(104, 136)));
  const aesKey = Hex.concat(sha1a.sliceBytes(0, 8), sha1b.sliceBytes(8, 20), sha1c.sliceBytes(4, 16));
  const aesIv = Hex.concat(sha1a.sliceBytes(8, 20), sha1b.sliceBytes(0, 8), sha1c.sliceBytes(16, 20), sha1d.sliceBytes(0, 8));

  const decryptedData = decrypt(data, aesKey, aesIv);

  return new MessageData(decryptedData.toBuffer());
}
