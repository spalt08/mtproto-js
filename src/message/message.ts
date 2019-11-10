import { Bytes } from '../serialization';
import TLConstructor from '../tl/constructor';
import PlainMessage from './plain';

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
    this.buf.slice(24, 28).uint = seq;
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
}
