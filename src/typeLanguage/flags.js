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
   * Gets value from view
   * @returns {number} Number
   */
  getValue(): number {
    if (this.view) this._value = this.view.getHex();

    return this._value;
  }

  /**
   * Sets value to view
   * @param {number} Number
   */
  setValue(data: number) {
    this._value = data;

    if (this.view) this.view.setHex(data);
  }
}
