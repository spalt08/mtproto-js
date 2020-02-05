import sha256 from '@cryptography/sha256';
// eslint-disable-next-line
import Message from './message';
import { decrypt } from '../crypto/ige';
import { Bytes, hex } from '../serialization';

/**
 * MessageEncrypted is a buffer with 24 byte padding, which has been encrypted.
 * Ref: https://core.telegram.org/mtproto/description#encrypted-message
 */
export default class EncryptedMessage {
  /** Byte data source of message */
  buf: Bytes;

  /** Length of message headers */
  hlen = 24;

  /** If message is content related */
  isContentRelated = true;

  constructor(src: ArrayBuffer | Bytes | number) {
    if (src instanceof ArrayBuffer) {
      this.buf = new Bytes(src);
      return;
    }

    if (src instanceof Bytes) {
      this.buf = src;
      return;
    }

    if (typeof src === 'number') {
      this.buf = new Bytes(this.hlen + src);
      return;
    }

    throw new Error(`Unable to create encrypted message with ${src}`);
  }

  /**
   * Method sets authKey to the first 8 bytes
   */
  set authKey(authKeyID: string) {
    this.buf.slice(0, 8).raw = authKeyID;
  }

  /**
   * Method sets 8-24 bytes with msg_key
   */
  set key(msgKey: string) {
    this.buf.slice(8, 24).raw = msgKey;
  }

  /**
   * Method gets hex string from 8-24 bytes
   */
  get key(): string {
    return this.buf.slice(8, 24).raw;
  }

  /**
   * Method sets encrypted_data from 24 byte
   */
  set data(data: Bytes) {
    this.buf.slice(24).raw = data.raw;
  }

  /**
   * Method gets encrypted_data starts 24 byte
   */
  get data(): Bytes {
    return this.buf.slice(24);
  }

  /**
   * Decrypts MessageEncrypted object with AES-256-IGE mode.
   * https://core.telegram.org/mtproto/description#protocol-description
   */
  decrypt(authKey: string): Message {
    const key = hex(authKey);
    const { data } = this;
    const msgKey = this.key;
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
}
