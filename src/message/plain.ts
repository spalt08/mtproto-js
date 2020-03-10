/* eslint-disable no-mixed-operators */
import { Bytes } from '../serialization';
import TLConstructor from '../tl/constructor';
import { TLNumber } from '../tl';

let lastGeneratedLo = 0;
let lastGeneratedHi = 0;

/**
 * MessagePlain is a buffer with 20 byte padding, which should not be encrypted.
 * Ref: https://core.telegram.org/mtproto/description#unencrypted-message
 */
export default class PlainMessage {
  /** Byte data source of message */
  buf: Bytes;

  /** Length of message headers */
  hlen = 20;

  /** Message nonce */
  nonce: string = '';

  /**
   * Creates new Bytes object from:
   * - AraryBuffer
   * - TLConstructor
   */
  constructor(src: Bytes | TLConstructor) {
    if (src instanceof Bytes) {
      this.buf = src;
      this.nonce = this.buf.slice(24, 40).hex;
      return;
    }

    if (src instanceof TLConstructor) {
      this.buf = new Bytes(this.hlen + src.byteSize);
      src.write(this.buf, this.hlen);

      this.id = PlainMessage.GenerateID();
      this.len();

      const { nonce } = src.params;
      if (nonce && nonce instanceof TLNumber && nonce.buf) this.nonce = nonce.buf.hex;

      return;
    }

    throw new Error(`Unable to create message with ${src}`);
  }

  /**
   * Method sets message identificator it to the 8-16 bytes
   */
  set id(id: string) {
    this.buf.slice(8, 16).lhex = id;
  }

  /**
   * Method gets message identificator from the 8-16 bytes
   */
  get id(): string {
    return this.buf.slice(8, 16).lhex;
  }

  /**
   * Method sets 16-20 bytes with message_data_length
   */
  len(): void {
    this.buf.slice(16, 20).uint = this.buf.length - this.hlen;
  }

  /**
   * Method sets encrypted_data from 20 byte
   */
  set data(data: Bytes) {
    this.buf.slice(20).raw = data.raw;
  }

  /**
   * Method gets encrypted_data starts 20 byte
   */
  get data(): Bytes {
    return this.buf.slice(20);
  }

  /**
   * Generates unique message identificator depending on current time
   */
  static GenerateID(): string {
    const time = Date.now();
    const nanosecond = Math.floor(time % 1000);
    const second = Math.floor(time / 1000);

    let generatedHi = second;
    let generatedLo = (nanosecond << 20 | nanosecond << 8 | 4);

    // avoid collisions
    if (lastGeneratedHi > generatedHi || (lastGeneratedHi === generatedHi && lastGeneratedLo >= generatedLo)) {
      generatedHi = lastGeneratedHi;
      generatedLo = lastGeneratedLo + 4;
    }

    lastGeneratedHi = generatedHi;
    lastGeneratedLo = generatedLo;

    return generatedHi.toString(16) + `0000${generatedLo.toString(16)}`.slice(-8);
  }
}
