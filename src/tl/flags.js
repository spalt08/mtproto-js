// @flow

import type { TLAny } from '../interfaces';
import TLAbstract from './abstract';

/** Represents flags handler for constructor */
export default class TLFlags extends TLAbstract implements TLAny {
  /** Type language notation name */
  _: string = 'flags';

  /**
   * Creates flags handler
   */
  constructor() {
    super();
    this.byteSize = 4;
  }

  /**
   * Tests if flag bit is set
   * @param {number} bit Bit Number
   * @returns {boolean} Result
   */
  has(bit: number): boolean {
    return (this._value & (1 << bit)) !== 0;
  }

  /**
   * Sets bit to flag
   * @param {number} bit Bit Number
   */
  set(bit: number) {
    this.value |= 1 << bit;
  }

  /**
   * Gets value
   * @returns {number} Number
   */
  get value(): number {
    if (this.view) this._value = this.view.getNumber();
    return this._value;
  }

  /**
   * Sets value
   * @param {number} Number
   */
  set value(data: number) {
    this._value = data;
    if (this.view) this.view.setNumber(this._value);
  }
}
