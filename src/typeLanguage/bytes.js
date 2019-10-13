/* eslint-disable no-underscore-dangle */
// @flow

import { GenericView, Hex } from '../serialization';
import TLType from './type';

/** TLString is a param constructor view for message buffer */
export default class TLBytes extends TLType {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = [
    'bytes', 'string',
  ];

  /** Length of string in bytes */
  stringLength: number = 0;

  /** Byte offset of inner string data */
  byteDataOffset: number = 1;

  /**
   * Creates TLString object from data
   * @param {string} data Data to set
   * @constructs
   */
  constructor(data?: string) {
    super();

    if (data) {
      this.setValue(data);
    } else {
      this.setValue('');
    }
  }

  /**
   * Creates view to Message Buffer to set and get values
   * @param {GenericBuffer} buf Message Buffer
   * @param {number} bufOffset Buffer Byte Offset
   */
  mapBuffer(buf: GenericBufffer, bufOffset?: number = 0) {
    if (this._value) {
      this.stringLength = this._value.length;
      this.byteDataOffset = this.stringLength > 253 ? 4 : 1;
      this.byteSize = this.byteDataOffset + this.stringLength;
      if (this.byteSize % 4) this.byteSize += 4 - (this.byteSize % 4);

      this.view = new GenericView(buf, bufOffset, this.byteSize);

      if (this.stringLength > 253) {
        this.view.setNumber(0xFE, 0);
        this.view.setNumber(this.stringLength, 1, 3);
      } else {
        this.view.setNumber(this.stringLength, 0, 1);
      }

      this.setValue(this._value);
    } else {
      const lengthView = new GenericView(buf, bufOffset, 4);
      const fb = lengthView.getNumber(0, 1);

      if (fb === 0xFE) {
        this.byteDataOffset = 4;
        this.stringLength = lengthView.getNumber(1, 3);
      } else {
        this.byteDataOffset = 1;
        this.stringLength = lengthView.getNumber(0, 1);
      }

      this.byteSize = this.byteDataOffset + this.stringLength;
      if (this.byteSize % 4) this.byteSize += 4 - (this.byteSize % 4);

      this.view = new GenericView(buf, bufOffset, this.byteSize);

      this.getValue();
    }

    return bufOffset + this.byteSize;
  }

  /**
   * Gets value from view
   * @returns {string} String
   */
  getValue(): string {
    if (this.view) {
      this._value = this.view.getString(this.byteDataOffset, this.stringLength);
    }

    return this._value;
  }

  /**
   * Gets hex from view
   * @param {boolean} littleEndian Is little endian
   * @returns {Hex} Hex string
   */
  getHex(littleEndian? = false): Hex {
    return this.view.getHex(this.byteDataOffset, this.stringLength, littleEndian);
  }

  /**
   * Sets hex to view
   * @param {string} hex Data to set
   */
  setHex(data: string) {
    const hex = new Hex(data);

    this.setValue(hex.toRawString());
  }

  /**
   * Gets number from view
   * @returns {number} Number
   */
  getNumber(): number {
    return this.view.getNumber(this.byteDataOffset, this.stringLength, false);
  }

  /**
   * sets number to view
   * @param {number} data Data to set
   */
  setNumber(data: number) {
    return this.view.setNumber(data, this.byteDataOffset, this.stringLength, false);
  }

  /**
   * Sets value to view
   * @param {string | Hex} String
   */
  setValue(data: string | Hex) {
    this._value = data.isHex ? data.toRawString() : data;

    this.stringLength = this._value.length;
    this.byteDataOffset = this.stringLength > 253 ? 4 : 1;
    this.byteSize = this.byteDataOffset + this.stringLength;
    if (this.byteSize % 4) this.byteSize += 4 - (this.byteSize % 4);

    if (this.view) this.view.setString(data, this.byteDataOffset, this.stringLength);
  }
}
