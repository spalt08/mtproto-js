// @flow

import { BigInteger } from 'big-integer';
import { TLAny } from '../interfaces';
import { GenericView, Hex, GenericBuffer } from '../serialization';
import TLAbstract from './abstract';

/**
 * Type language bytes represents any of string or bytes constructors
 * @extends AbstractConstructor
 */
export default class TLBytes extends TLAbstract implements TLAny {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = [
    'bytes', 'string',
  ];

  /** Type language notation name */
  _: string = 'bytes';

  /** Represents bare types */
  isBare: boolean = true;

  /** Length of string in bytes */
  stringLength: number = 0;

  /** Byte offset of inner string data */
  byteDataOffset: number = 1;

  /** Value to store, if no buffer mapped */
  _value: string;

  /**
   * Creates TLString object from data
   * @param {string} data Data to be setted
   */
  constructor(predicate: string, data?: string) {
    super();

    this._ = predicate;
    if (data) {
      this.value = data;
    } else {
      this.value = '';
    }
  }

  /**
   * Gets string
   * @returns {string} String
   */
  get value(): any {
    if (this.view) {
      this._value = this.view.getString(this.byteDataOffset, this.stringLength);
      if (this._ === 'string') {
        try {
          this._value = decodeURIComponent(escape(this._value));
        } catch (e) {
          console.log('Type Language: Unable to decode string value "', this._value, '"');
        }
      }
    }

    return this._value;
  }

  /**
   * Sets string
   * @param {string | Hex} String
   */
  set value(data: any) {
    if (typeof data === 'object' && data instanceof Hex) {
      this._value = data.toRawString();
    } else {
      this._value = data;
      if (this._ === 'string' && this._value) this._value = unescape(encodeURIComponent(data));
    }

    this.stringLength = this._value ? this._value.length : 0;
    this.byteDataOffset = this.stringLength > 253 ? 4 : 1;
    this.byteSize = this.byteDataOffset + this.stringLength;

    if (this.byteSize % 4) {
      this.byteSize += 4 - (this.byteSize % 4); // Padding
    }

    if (this.view) {
      if (this.stringLength > 253) {
        this.view.setNumber(0xFE, 0, 1);
        this.view.setNumber(this.stringLength, 1, 3);
      } else {
        this.view.setNumber(this.stringLength, 0, 1);
      }

      this.view.setString(this._value, this.byteDataOffset, this.stringLength);
    }
  }

  /**
   * Gets bytes in hex
   * @returns {Hex} Hex string
   */
  get hex(): Hex {
    return this.view.getHex(this.byteDataOffset, this.stringLength);
  }

  /**
   * Sets bytes in hex
   * @param {string | Hex} hex Data to set
   */
  set hex(data: Hex) {
    const hex = new Hex(data);
    this.value = hex.toRawString();
  }

  /**
   * Gets number
   * @returns {number} Number
   */
  get number(): number | BigInteger {
    return this.view.getNumber(this.byteDataOffset, this.stringLength, false);
  }

  /**
   * Sets number
   * @param {number} data Data to set
   */
  set number(data: number | BigInteger) {
    this.value = new Hex(data.toString(16)).toRawString();
  }

  /**
   * Method maps part of buffer
   * @param {GenericBuffer} buf Buffer for mapping
   * @param {number} offset Byte offset for mapping buffer
   * @returns {number} Byte offset after mapping
   */
  map(buf: GenericBuffer, offset: number = 0) {
    if (this._value) {
      this.view = new GenericView(buf, offset, this.byteSize);
      this.value = this._value;
    } else {
      const lengthView = new GenericView(buf, offset, 4);
      const fb = lengthView.getNumber(0, 1);

      if (fb === 0xFE) {
        this.byteDataOffset = 4;
        this.stringLength = lengthView.getNumber(1, 3) as number;
      } else {
        this.byteDataOffset = 1;
        this.stringLength = lengthView.getNumber(0, 1) as number;
      }

      this.byteSize = this.byteDataOffset + this.stringLength;
      if (this.byteSize % 4) this.byteSize += 4 - (this.byteSize % 4);

      this.view = new GenericView(buf, offset, this.byteSize);

      this._value = this.value;
    }

    return offset + this.byteSize;
  }
}
