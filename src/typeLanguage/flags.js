/* eslint-disable no-underscore-dangle */
// @flow

import TLType from './type';

/** TLBoolean is a param constructor view for message buffer */
export default class TLFlags extends TLType {
  /**
   * Creates view to Message Buffer to set and get values
   * @param {any} data Data to set
   * @constructs
   */
  constructor(data: any) {
    super();

    this.byteSize = 4;

    if (data) this.setValue(data);
  }

  /**
   * Tests if flag bit is set
   * @param {number} bit Bit Number
   * @returns {boolean} Result
   */
  has(bit: number): boolean {
    return (this._value >> bit) % 2 === 1;
  }

  /**
   * Sets bit to flag
   * @param {number} bit Bit Number
   */
  set(bit: number) {
    this._value |= 1 << bit;
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
   * @param {number} Number
   */
  setValue(data: number) {
    this._value = data;

    if (this.view) this.view.setNumber(this._value);
  }
}
