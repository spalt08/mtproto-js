/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
// @flow

import BigInt from 'big-integer';
import GenericBuffer from './genericBuffer';
import Hex from './hex';

/** GenericView is a wrapper for native DataView */
export default class GenericView extends DataView {
  /**
   * @constructs
   * GenericView can be made from GenericBuffer or ArrayBuffer
   */
  constructor(source: GenericBuffer | ArrayBuffer, offset?: number = 0, len?: number) {
    if (source instanceof GenericBuffer) {
      super(source.buf, source.bytePaddingBefore + offset, len);
    } else {
      super(source, offset, len);
    }
  }

  /** Debug stuff */
  get hex(): string {
    const bytes = [];

    for (let i = 0; i < this.byteLength; i += 1) {
      bytes.push(this.getUint8(i));
    }

    return Hex.fromCharCode(...bytes).toString();
  }

  /** Debug stuff */
  get goRight(): GenericView {
    return new GenericView(this.buffer, this.byteOffset + this.byteLength, 10);
  }

  /** Debug stuff */
  get goLeft(): GenericView {
    return new GenericView(this.buffer, this.byteOffset - 10, 10);
  }

  /**
   * The method returns hex-string data from array buffer slice
   * @param {number} offset Byte offset
   * @param {number} len Byte length
   * @param {boolean} littleEndian Flag for little endianess
   * @returns {Hex} hex-string
   */
  getHex(offset: number = 0, len: number = this.byteLength, littleEndian: boolean = false): Hex {
    const bytes = [];

    for (let i = 0; i < len; i += 1) {
      bytes.push(this.getUint8(offset + (littleEndian ? len - 1 - i : i)));
    }

    return Hex.fromCharCode(...bytes);
  }

  /**
   * The method sets hex-string data to array buffer slice
   * @param {Hex | string} hex Data to set
   * @param {number} offset Byte offset
   * @param {number} len Byte length
   * @param {boolean} littleEndian Flag for little endianess
   */
  setHex(hexStr: Hex | string, offset: number = 0, len: number = this.byteLength, littleEndian: boolean = false) {
    const hex = new Hex(hexStr);

    const bound = Math.min(len, hex.byteLength);

    for (let i = 0; i < bound; i += 1) {
      this.setUint8(offset + (littleEndian ? bound - i - 1 : i), hex.byteAt(i));
    }
  }

  /**
   * The method returns number from buffer slice
   * @param {number} offset Byte offset
   * @param {number} len Byte length
   * @returns {number} Result number
   */
  getNumber(offset: number = 0, len: number = this.byteLength, littleEndian: boolean = true): number {
    switch (len) {
      case 1: return this.getUint8(offset);
      case 2: return this.getInt16(offset, littleEndian);
      case 4: return this.getInt32(offset, littleEndian);

      case 3: return parseInt(
        `0${this.getUint8(offset + 2).toString(16)}`.slice(-2)
      + `0${this.getUint8(offset + 1).toString(16)}`.slice(-2)
      + `0${this.getUint8(offset + 0).toString(16)}`.slice(-2),
        16,
      );

      default:
        return BigInt(this.getHex(offset, len, littleEndian), 16);
    }
  }

  /**
   * The method sets number to buffer slice
   * @param {number} data Data to set
   * @param {number} offset Byte offset
   * @param {number} len Byte length
   */
  setNumber(data: number, offset: number = 0, len: number = this.byteLength, littleEndian: boolean = true) {
    switch (len) {
      case 1: this.setUint8(offset, data); break;
      case 2: this.setUint16(offset, data, littleEndian); break;
      case 4: this.setUint32(offset, data, littleEndian); break;
      // To Do: Fix setting big int
      // case 8: this.setBigInt64(offset, data, littleEndian); break;

      default:
        this.setHex(data.toString(16), offset, len, littleEndian);
        break;
    }
  }

  /**
   * The method returns string from buffer slice
   * @param {number} offset Byte offset
   * @param {number} len Byte length
   * @returns {string} Result string
   */
  getString(offset: number = 0, len: number = this.byteLength): string {
    let str = '';

    for (let i = 0; i < len; i += 1) str += String.fromCharCode(this.getUint8(offset + i));

    return str;
  }

  /**
   * The method string string to buffer slice
   * @param {string} data Data to set
   * @param {number} offset Byte offset
   * @param {number} len Byte length
   */
  setString(data: string, offset: number = 0, len: number = this.byteLength) {
    for (let i = 0; i < len; i += 1) this.setUint8(offset + i, data.charCodeAt(i));
  }
}
