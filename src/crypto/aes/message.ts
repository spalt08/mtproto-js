import sha256 from '@cryptography/sha256';
import sha1 from '@cryptography/sha1';
import { encrypt, decrypt } from './ige';
import { Message, EncryptedMessage } from '../../message';
import { hex, Bytes } from '../../serialization';

/**
 * Encrypts MessageData object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description#protocol-description
 */
export function encryptMessage(authKey: string, msg: Message): EncryptedMessage {
  // const msgKeyLarge = sha256(key.slice(88, 120).raw + data.raw);
  // const msgKey = msgKeyLarge.slice(8, 24);
  // const sha256a = sha256(msgKey.raw + key.slice(0, 36).raw);
  // const sha256b = sha256(key.slice(40, 76).raw + msgKey.raw);
  // const aesKey = hex(sha256a.slice(0, 8).hex + sha256b.slice(8, 24).hex + sha256a.slice(24, 32).hex);
  // const aesIv = hex(sha256b.slice(0, 8).hex + sha256a.slice(8, 24).hex + sha256b.slice(24, 32).hex);
  // const encryptedData = encrypt(data, aesKey, aesIv);

  // const encMsg = new EncryptedMessage(encryptedData.length);

  // encMsg.authKey = sha1(key.raw).slice(12, 20).hex;
  // encMsg.key = msgKey.hex;
  // encMsg.data = encryptedData;
  const key = hex(authKey);
  const data = msg.buf;
  const msgKeyLarge = sha256(key.slice(88, 120).raw + data.raw);
  const msgKey = msgKeyLarge.slice(8, 24);
  const sha256a = sha256(msgKey + key.slice(0, 36).raw);
  const sha256b = sha256(key.slice(40, 76).raw + msgKey);

  const aesKey = new Bytes(32);
  aesKey.slice(0, 8).raw = sha256a.slice(0, 8);
  aesKey.slice(8, 24).raw = sha256b.slice(8, 24);
  aesKey.slice(24, 32).raw = sha256a.slice(24, 32);

  const aesIv = new Bytes(32);
  aesIv.slice(0, 8).raw = sha256b.slice(0, 8);
  aesIv.slice(8, 24).raw = sha256a.slice(8, 24);
  aesIv.slice(24, 32).raw = sha256b.slice(24, 32);

  const encryptedData = encrypt(data, aesKey, aesIv);

  const encMsg = new EncryptedMessage(encryptedData.length);

  encMsg.authKey = sha1(key.raw).slice(12, 20);
  encMsg.key = msgKey;
  encMsg.data = encryptedData;

  return encMsg;
}

/**
 * Decrypts MessageEncrypted object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description#protocol-description
 */
export function decryptMessage(authKey: string, msg: EncryptedMessage): Message {
  const key = hex(authKey);
  const { data } = msg;
  const msgKey = msg.key;
  const sha256a = sha256(msgKey + key.slice(8, 44).raw);
  const sha256b = sha256(key.slice(48, 84).raw + msgKey);

  const aesKey = new Bytes(32);
  aesKey.slice(0, 8).raw = sha256a.slice(0, 8);
  aesKey.slice(8, 24).raw = sha256b.slice(8, 24);
  aesKey.slice(24, 32).raw = sha256a.slice(24, 32);

  const aesIv = new Bytes(32);
  aesIv.slice(0, 8).raw = sha256b.slice(0, 8);
  aesIv.slice(8, 24).raw = sha256a.slice(8, 24);
  aesIv.slice(24, 32).raw = sha256b.slice(24, 32);

  const decryptedData = decrypt(data, aesKey, aesIv);

  return new Message(decryptedData);
}
