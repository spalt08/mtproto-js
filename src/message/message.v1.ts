import sha1 from '@cryptography/sha1';
import Message from './message';
import { hex, Bytes } from '../serialization';
import { encrypt } from '../crypto/ige';
import EncryptedMessage from './encrypted';

export default class MessageV1 extends Message {
  // eslint-disable-next-line
  getPaddingLen(len: number) {
    return 16 - (len % 16);
  }

  /**
   * MTProto v1.0
   * Encrypts MessageData object with AES-256-IGE mode.
   * https://core.telegram.org/mtproto/description_v1
   */
  encrypt(authKey: string): EncryptedMessage {
    const data = this.buf;
    const key = hex(authKey);

    const msgKey = sha1(data.slice(0, this.hlen + this.dataLength).raw).slice(4, 20);
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
}
