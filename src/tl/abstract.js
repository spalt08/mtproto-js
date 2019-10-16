// @flow

import type { TLAny } from '../interfaces';
import { GenericView, GenericBuffer, Hex } from '../serialization';

/** Abstract class for any type language constructor */
export default class TLAbstract implements TLAny {
  /** Represents bare types */
  isBare: boolean;

  /** Represents optional fields in constructor */
  isOptional: boolean = false;

  /** Flag bit for optional types */
  flagIndex: number = 0;

  /* Adapter to buffer */
  view: GenericView;

  /** Byte size for allocation */
  byteSize: number = 0;

  /** Value to store, if no buffer mapped */
  _value: any = null;

  /**
   * Gets value from constructor
   * @returns {any} Stored data
   */
  get value(): any {
    if (this.view) this._value = this.view.getHex();
    return this._value;
  }

  /**
   * Sets value to constructor
   * @param {any} data Data to set
   */
  set value(data: any) {
    this._value = new Hex(data);
    if (this.view) this.view.setHex(this._value);
  }

  /**
   * Gets hex from constructor
   * @returns {Hex} Hex string
   */
  get hex(): Hex {
    if (this.view) this._value = this.view.getHex();
    return this._value;
  }

  /**
   * Sets hex to constructor
   * @param {any} data Data to set
   */
  set hex(data: any) {
    this._value = new Hex(data);
    if (this.view) this.view.setHex(this._value);
  }

  /**
   * Method maps part of buffer
   * @param {GenericBuffer} buf Buffer for mapping
   * @param {number} offset Byte offset for mapping buffer
   * @returns {number} Byte offset after mapping
   */
  map(buf: GenericBuffer, offset?: number = 0) {
    if (this.byteSize > 0) {
      this.view = new GenericView(buf, offset, this.byteSize);

      if (this._value) {
        this.value = this._value;
      } else {
        this._value = this.value;
      }
    }

    return offset + this.byteSize;
  }

  /**
   * Checks if constructor has any value
   * @returns {boolean} If constructor has any value
   */
  hasValue(): boolean {
    return this.value;
  }
}
