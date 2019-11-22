import sha256 from '../sha256';
import { encrypt, decrypt } from './ige';
import { Message, EncryptedMessage } from '../../message';
import { hex } from '../../serialization';
import sha1 from '../sha1';

/**
 * Encrypts MessageData object with AES-256-IGE mode.
 * https://core.telegram.org/mtproto/description#protocol-description
 */
export function encryptMessage(authKey: string, msg: Message): EncryptedMessage {
  const key = hex(authKey);
  const data = msg.buf;
  const msgKeyLarge = sha256(key.slice(88, 120).raw + data.raw);
  const msgKey = msgKeyLarge.slice(8, 24);
  const sha256a = sha256(msgKey.raw + key.slice(0, 36).raw);
  const sha256b = sha256(key.slice(40, 76).raw + msgKey.raw);
  const aesKey = hex(sha256a.slice(0, 8).hex + sha256b.slice(8, 24).hex + sha256a.slice(24, 32).hex);
  const aesIv = hex(sha256b.slice(0, 8).hex + sha256a.slice(8, 24).hex + sha256b.slice(24, 32).hex);
  const encryptedData = encrypt(data, aesKey, aesIv);

  const encMsg = new EncryptedMessage(encryptedData.length);

  encMsg.authKey = sha1(key.raw).slice(12, 20).hex;
  encMsg.key = msgKey.hex;
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
  const msgKey = hex(msg.key);
  const sha256a = sha256(msgKey.raw + key.slice(8, 44).raw);
  const sha256b = sha256(key.slice(48, 84).raw + msgKey.raw);
  const aesKey = hex(sha256a.slice(0, 8).hex + sha256b.slice(8, 24).hex + sha256a.slice(24, 32).hex);
  const aesIv = hex(sha256b.slice(0, 8).hex + sha256a.slice(8, 24).hex + sha256b.slice(24, 32).hex);

  const decryptedData = decrypt(data, aesKey, aesIv);

  return new Message(decryptedData);
}
