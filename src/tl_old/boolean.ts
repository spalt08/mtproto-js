// @flow

import { TLAny } from '../interfaces';
import TLAbstract from './abstract';

const TL_TRUE = '997275b5';
const TL_FALSE = 'bc799737';

/** TLBoolean is a param constructor view for message buffer */
export default class TLBoolean extends TLAbstract implements TLAny {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = ['Bool', 'true'];

  /**
   * Acceptable hexes
   * @static
   */
  static ValidHex = [TL_TRUE, TL_FALSE];

  /** Type language notation name */
  _: string = 'Bool';

  /** Value to store, if no buffer mapped */
  _value: boolean = false;

  /**
   * Creates type language boolean constructor
   * @param {any} data Data to set
   * @param {boolean} isOptional Is flag boolean
   * @constructs
   */
  constructor(predicate: string, data: any = null, isOptional: boolean = false) {
    super();

    this.isOptional = isOptional;
    this._ = predicate;

    if (data) this.value = data;
  }

  /**
   * Gets bool
   * @returns {boolean} Bool
   */
  get value(): boolean {
    if (this.view) this._value = this.view.getHex(0, 4, true).toString() === TL_TRUE;
    return this._value;
  }

  /**
   * Sets boolean
   * @param {boolean} data
   */
  set value(data: boolean) {
    this._value = data;
    if (this.view) this.view.setHex(data === true ? TL_TRUE : TL_FALSE);
  }

  /**
   * Gets byte size
   * @returns {number} Byte size
   */
  get byteSize(): number {
    return this.isOptional && this._ === 'true' ? 0 : 4;
  }

  /**
   * Sets byte size
   * @param {number} size Byte size
   */
  set byteSize(size: number) {
    this._byteSize = this.isOptional && this._ === 'true' ? 0 : 4;
  }
}
