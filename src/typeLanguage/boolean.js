/* eslint-disable no-underscore-dangle */
// @flow

import TLType from './type';

const TL_TRUE = '997275b5';
const TL_FALSE = 'bc799737';

/** TLBoolean is a param constructor view for message buffer */
export default class TLBoolean extends TLType {
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
   * @returns {boolean} Bool
   */
  getValue(): boolean {
    if (this.view) this._value = this.view.getHex(0, 4, true).toString() === TL_TRUE;

    return this._value;
  }

  /**
   * Sets value to view
   * @param {boolean} data
   */
  setValue(data: boolean) {
    this._value = data;

    if (this.view) this.view.setHex(data === true ? TL_TRUE : TL_FALSE);
  }
}
