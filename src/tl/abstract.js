// @flow

import type { TLAny } from '../interfaces';
import { GenericView, GenericBuffer, Hex } from '../serialization';

/** Abstract class for any type language constructor */
export default class TLAbstract implements TLAny {
  /** Type language notation name */
  _: string = 'void';

  /** Represents bare types */
  isBare: boolean;

  /** Represents optional fields in constructor */
  isOptional: boolean = false;

  /** Flag bit for optional types */
  flagIndex: number = 0;

  /* Adapter to buffer */
  view: GenericView;

  /** Byte size for allocation */
  _byteSize: number = 0;

  /** Constructor params */
  params: { [string]: TLAny } = {};

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
   * Gets byte size for allocation
   * @returns {number} Byte size
   */
  get byteSize() {
    return this._byteSize;
  }

  /**
   * Sets byte size for allocation
   * @param {number} size Byte size
   */
  set byteSize(size: number) {
    this._byteSize = size;
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

  /**
   * Shortcut for getting value
   * @returns {any} Json Object
   */
  json(): any {
    return this.value;
  }
}
