import sha256 from '@cryptography/sha256';
import sha1 from '@cryptography/sha1';
import PlainMessage from './plain';
// eslint-disable-next-line
import EncryptedMessage from './encrypted';
import TLConstructor from '../tl/constructor';
import { Bytes, hex } from '../serialization';
import { encrypt } from '../crypto/ige';

/**
 * Message is a buffer with 32 byte padding, which should be encrypted.
 * Ref: https://core.telegram.org/mtproto/description#encrypted-message-encrypted-data
 */
export default class Message {
  /** Byte data source of message */
  buf: Bytes;

  /** Length of message headers */
  hlen = 32;

  /** Padding length */
  plen: number = 0;

  /** If message is content related */
  isContentRelated = true;

  /**
   * Creates new Bytes object from:
   * - AraryBuffer
   * - TLConstructor
   */
  constructor(src: Bytes | TLConstructor) {
    if (src instanceof Bytes) {
      this.buf = src;
      return;
    }

    if (src instanceof TLConstructor) {
      this.plen = this.getPaddingLen(src.byteSize);
      this.buf = new Bytes(this.hlen + src.byteSize + this.plen);
      src.write(this.buf, this.hlen);

      this.id = Message.GenerateID();
      this.len();
      this.padding();
      return;
    }

    throw new Error(`Unable to create message with ${src}`);
  }

  // eslint-disable-next-line
  getPaddingLen(len: number) {
    return 32 - (len % 16); // + Math.floor(Math.random() * 20) * 16;
  }

  /**
   * Method sets message identificator it to the 16-24 bytes
   */
  set id(id: string) {
    this.buf.slice(16, 24).lhex = id;
  }

  /**
   * Method gets message identificator from the 16-24 bytes
   */
  get id(): string {
    return this.buf.slice(16, 24).lhex;
  }

  /**
   * Method sets 28-32 bytes with message_data_length
   */
  len(): void {
    this.buf.slice(28, 32).int32 = this.buf.length - this.hlen - this.plen;
  }

  get dataLength(): number {
    return this.buf.slice(28, 32).int32;
  }

  /**
   * Method sets first 8 bytes with salt header
   */
  set salt(salt: string) {
    this.buf.slice(0, 8).hex = salt;
  }

  /**
   * Method sets second 8-16 bytes with session_id header
   */
  set sessionID(sid: string) {
    this.buf.slice(8, 16).hex = sid;
  }

  /**
   * Method sets 24-28 bytes with seq_no header
   */
  set seqNo(seq: number) {
    this.buf.slice(24, 28).int32 = seq;
  }

  /**
   * Method gets 24-28 bytes with seq_no header
   */
  get seqNo(): number {
    return this.buf.slice(24, 28).int32;
  }

  /**
   * Method sets encrypted_data from 32 byte
   */
  set data(data: Bytes) {
    this.buf.slice(32, 32 + this.dataLength).raw = data.raw;
  }

  /**
   * Method gets encrypted_data starts 32 byte
   */
  get data(): Bytes {
    return this.buf.slice(32, 32 + this.dataLength);
  }

  /**
   * Method sets padding bytes with random data
   */
  padding() {
    this.buf.slice(this.buf.length - this.plen).randomize();
  }

  /**
   * Generates unique message identificator depending on current time
   */
  static GenerateID(): string {
    return PlainMessage.GenerateID();
  }

  /**
   * Encrypts MessageData object with AES-256-IGE mode.
   * https://core.telegram.org/mtproto/description#protocol-description
   */
  encrypt(authKey: string): EncryptedMessage {
    const key = hex(authKey);
    const data = this.buf;
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
}
