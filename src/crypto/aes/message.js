// @flow

import type { Message } from '../../interfaces';

import { MessageData, MessageEncrypted, Hex } from '../../serialization';
import SHA256 from '../sha256';
import encrypt from './encrypt';
import decrypt from './decrypt';

/**
 * Encrypts MessageData object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description#protocol-description
 *
 * @param {Hex} authKey Auth Key
 * @param {MessageData} msg Unencrypted Message
 * @returns {MessageEncrypted} Encrypted Message
 */
export function encryptDataMessage(authKey: {key: Hex, id: Hex}, msg: Message): MessageEncrypted {
  const data = msg.toHex();
  const dataToHash = new Hex(Hex.concat(authKey.key.sliceBytes(88, 120), data));
  const msgKeyLarge = SHA256.Hex(dataToHash);
  const msgKey = msgKeyLarge.sliceBytes(8, 24);
  const sha256a = SHA256.Hex(Hex.concat(msgKey, authKey.key.sliceBytes(0, 36)));
  const sha256b = SHA256.Hex(Hex.concat(authKey.key.sliceBytes(40, 76), msgKey));
  const aesKey = Hex.concat(sha256a.sliceBytes(0, 8), sha256b.sliceBytes(8, 24), sha256a.sliceBytes(24, 32));
  const aesIv = Hex.concat(sha256b.sliceBytes(0, 8), sha256a.sliceBytes(8, 24), sha256b.sliceBytes(24, 32));
  const encryptedData = encrypt(data, aesKey, aesIv);

  const encMsg = new MessageEncrypted(encryptedData.byteLength);

  encMsg.setAuthKey(authKey.id);
  encMsg.setMsgKey(msgKey);
  encMsg.setData(encryptedData);

  return encMsg;
}

/**
 * Decrypts MessageEncrypted object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description#protocol-description
 *
 * @param {Hex} authKey Auth Key
 * @param {MessageEncrypted} msg Encrypted Message
 * @returns {MessageData} Unencrypted Message
 */
export function decryptDataMessage(authKey: {key: Hex, id: Hex}, msg: MessageEncrypted): MessageData {
  const data = msg.getData();
  const msgKey = msg.getMsgKey();
  const sha256a = SHA256.Hex(Hex.concat(msgKey, authKey.key.sliceBytes(8, 44)));
  const sha256b = SHA256.Hex(Hex.concat(authKey.key.sliceBytes(48, 84), msgKey));
  const aesKey = Hex.concat(sha256a.sliceBytes(0, 8), sha256b.sliceBytes(8, 24), sha256a.sliceBytes(24, 32));
  const aesIv = Hex.concat(sha256b.sliceBytes(0, 8), sha256a.sliceBytes(8, 24), sha256b.sliceBytes(24, 32));

  const decryptedData = decrypt(data, aesKey, aesIv);

  return new MessageData(decryptedData.toBuffer());
}
