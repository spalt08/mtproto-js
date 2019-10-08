/* eslint-disable no-underscore-dangle */
// @flow

import { GenericView, Hex } from '../serialization';

/** Abstract class for any TL entity */
export default class TLType {
  /* Size of entity in bytes */
  byteSize: number = 0;

  /* Adapter to buffer */
  view: ?GenericView;

  /** Value to store, if no buffer */
  _value: any;

  /**
   * Creates view to Message Buffer to set and get values
   * @param {GenericBuffer} buf Message Buffer
   * @param {number} bufOffset Buffer Byte Offset
   */
  mapBuffer(buf: GenericBufffer, bufOffset?: number = 0) {
    this.view = new GenericView(buf, bufOffset, this.byteSize);

    if (this._value) {
      this.setValue(this._value);
    } else {
      this.getValue();
    }

    return bufOffset + this.byteSize;
  }

  /**
   * Gets value from view
   * @returns {Hex} Hex string
   */
  getValue(): Hex {
    if (this.view) this._value = this.view.getHex();

    return this._value;
  }

  /**
   * Sets value to view
   * @param {string} data Hex
   */
  setValue(data: string) {
    this._value = new Hex(data);

    if (this.view) this.view.setHex(this._value);
  }
}
