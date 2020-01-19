import sha1 from '@cryptography/sha1';
import { encrypt, decrypt } from './ige';
import { MessageV1, EncryptedMessage } from '../../message';
import { hex, Bytes } from '../../serialization';

/**
 * MTProto v1.0
 * Encrypts MessageData object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description_v1
 */
export function encryptMessageV1(authKey: string, msg: MessageV1): EncryptedMessage {
  const data = msg.buf;
  const key = hex(authKey);

  const msgKey = sha1(data.slice(0, msg.hlen + msg.dataLength).raw).slice(4, 20);
  const sha1a = sha1(msgKey + key.slice(0, 32).raw);
  const sha1b = sha1(key.slice(32, 48).raw + msgKey + key.slice(48, 64).raw);
  const sha1c = sha1(key.slice(64, 96).raw + msgKey);
  const sha1d = sha1(msgKey + key.slice(96, 128).raw);

  const aesKey = new Bytes(32);
  aesKey.slice(0, 8).raw = sha1a.slice(0, 8);
  aesKey.slice(8, 20).raw = sha1b.slice(8, 20);
  aesKey.slice(20, 32).raw = sha1c.slice(4, 16);

  const aesIv = new Bytes(32);
  aesIv.slice(0, 12).raw = sha1a.slice(8, 20);
  aesIv.slice(12, 20).raw = sha1b.slice(0, 8);
  aesIv.slice(20, 24).raw = sha1c.slice(16, 20);
  aesIv.slice(24, 32).raw = sha1d.slice(0, 8);

  const encryptedData = encrypt(data, aesKey, aesIv);

  const encMsg = new EncryptedMessage(encryptedData.length);

  encMsg.authKey = sha1(key.raw).slice(12, 20);
  encMsg.key = msgKey;
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

  const sha1a = sha1(msgKey.raw + key.slice(8, 40).raw);
  const sha1b = sha1(key.slice(40, 56).raw + msgKey.raw + key.slice(56, 72).raw);
  const sha1c = sha1(key.slice(72, 104).raw + msgKey.raw);
  const sha1d = sha1(msgKey.raw + key.slice(104, 136).raw);

  const aesKey = new Bytes(32);
  aesKey.slice(0, 8).raw = sha1a.slice(0, 8);
  aesKey.slice(8, 20).raw = sha1b.slice(8, 20);
  aesKey.slice(20, 32).raw = sha1c.slice(4, 16);

  const aesIv = new Bytes(32);
  aesIv.slice(0, 12).raw = sha1a.slice(8, 20);
  aesIv.slice(12, 20).raw = sha1b.slice(0, 8);
  aesIv.slice(20, 24).raw = sha1c.slice(16, 20);
  aesIv.slice(24, 32).raw = sha1d.slice(0, 8);

  const decryptedData = decrypt(data, aesKey, aesIv);

  return new MessageV1(decryptedData);
}
