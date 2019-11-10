import sha1 from '../sha1';
import { encrypt, decrypt } from './ige';
import { MessageV1, EncryptedMessage } from '../../message';
import { hex } from '../../serialization';

/**
 * MTProto v1.0
 * Encrypts MessageData object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description_v1
 */
export function encryptMessageV1(authKey: { key: string, id: string }, msg: MessageV1): EncryptedMessage {
  const data = msg.buf;
  const key = hex(authKey.key);

  const msgKey = sha1(data.slice(0, msg.hlen + msg.dataLength)).slice(4, 20);
  const sha1a = sha1(hex(msgKey.hex + key.slice(0, 32).hex));
  const sha1b = sha1(hex(key.slice(32, 48).hex + msgKey.hex + key.slice(48, 64).hex));
  const sha1c = sha1(hex(key.slice(64, 96).hex + msgKey.hex));
  const sha1d = sha1(hex(msgKey.hex + key.slice(96, 128).hex));
  const aesKey = hex(sha1a.slice(0, 8).hex + sha1b.slice(8, 20).hex + sha1c.slice(4, 16).hex);
  const aesIv = hex(sha1a.slice(8, 20).hex + sha1b.slice(0, 8).hex + sha1c.slice(16, 20).hex + sha1d.slice(0, 8).hex);

  const encryptedData = encrypt(data, aesKey, aesIv);

  const encMsg = new EncryptedMessage(encryptedData.length);

  encMsg.authKey = authKey.id;
  encMsg.key = msgKey.hex;
  encMsg.data = encryptedData;

  return encMsg;
}

/**
 * MTProto v1.0
 * Decrypts MessageEncrypted object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description_v1
 */
export function decryptMessageV1(authKey: { key: string, id: string }, msg: EncryptedMessage): MessageV1 {
  const key = hex(authKey.key);
  const { data } = msg;
  const msgKey = hex(msg.key);

  const sha1a = sha1(hex(msgKey.hex + key.slice(8, 40).hex));
  const sha1b = sha1(hex(key.slice(40, 56).hex + msgKey.hex + key.slice(56, 72).hex));
  const sha1c = sha1(hex(key.slice(72, 104).hex + msgKey.hex));
  const sha1d = sha1(hex(msgKey.hex + key.slice(104, 136).hex));
  const aesKey = hex(sha1a.slice(0, 8).hex + sha1b.slice(8, 20).hex + sha1c.slice(4, 16).hex);
  const aesIv = hex(sha1a.slice(8, 20).hex + sha1b.slice(0, 8).hex + sha1c.slice(16, 20).hex + sha1d.slice(0, 8).hex);

  const decryptedData = decrypt(data, aesKey, aesIv);

  return new MessageV1(decryptedData);
}
