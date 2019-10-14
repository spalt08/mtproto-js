/* eslint-disable no-underscore-dangle */
// @flow

import BigInt from 'big-integer';
import { Hex } from '../serialization';
import TLType from './type';

/** TLNumber is a param constructor view for message buffer */
export default class TLNumber extends TLType {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = [
    'int', 'int64', 'int128', 'int256', 'long',
  ];

  /**
   * TLNumber can be made from TLConstructor param data with our without allocated buffer
   * @param {string} predicate Number type
   * @param {any} data Data to set
   * @constructs
   */
  constructor(predicate: string, data: any) {
    super();

    switch (predicate) {
      case 'int': this.byteSize = 4; break;
      case 'int64': this.byteSize = 8; break;
      case 'int128': this.byteSize = 16; break;
      case 'int256': this.byteSize = 32; break;
      case 'long': this.byteSize = 8; break;
      default:
        throw new Error(`TypeLanguage: Unknown number ${predicate}`);
    }

    if (data) this.setValue(data);
  }

  /**
   * Gets value from view
   * @returns {number} Number
   */
  getValue(): number {
    if (this.view) this._value = this.view.getNumber();

    return this._value;
  }

  /**
   * Sets value to view
   * @param {number | Hex} Number
   */
  setValue(data: number | Hex) {
    this._value = typeof data === 'object' && data instanceof Hex ? BigInt(data.reverseBytes().toString(), 16) : data;
    if (this.view) this.view.setNumber(this._value);
  }

  /**
   * Gets hex from view
   * @returns {?Hex} Hex string
   */
  getHex(littleEndian?: boolean = false): ?Hex {
    if (this.view) return this.view.getHex(undefined, undefined, littleEndian);

    return null;
  }
}
