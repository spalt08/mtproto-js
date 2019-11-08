// @flow

import BigInt, { BigInteger } from 'big-integer';
import { TLAny } from '../interfaces';
import { Hex } from '../serialization';
import TLAbstract from './abstract';

/**
 * Type language number represents any of number constructors in type language
 * @extends AbstractConstructor
 */
export default class TLNumber extends TLAbstract implements TLAny {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = [
    'int', 'int64', 'int128', 'int256', 'long',
  ];

  /** Represents bare types */
  isBare: boolean = true;

  /** Value to store, if no buffer mapped */
  _value: number | BigInteger;

  /**
   * Creates new type language number
   * @param {string} predicate Number type
   * @param {any} number Data to be setted
   * @param {boolean} isOptional If param is optional
   * @constructs
   */
  constructor(predicate: string, data?: number) {
    super();

    this._ = predicate;

    switch (predicate) {
      case 'int': this.byteSize = 4; break;
      case 'int64': this.byteSize = 8; break;
      case 'int128': this.byteSize = 16; break;
      case 'int256': this.byteSize = 32; break;
      case 'long': this.byteSize = 8; break;
      default:
        throw new Error(`TypeLanguage: Unknown number ${predicate}`);
    }

    if (data) this.value = data;
  }

  /**
   * Gets number from type language number
   * @returns {number} Number
   */
  get value(): number | BigInteger | Hex {
    if (this.view) this._value = this.view.getNumber() as number;
    return this._value;
  }

  /**
   * Sets number to type language number
   * @param {number | Hex} Number
   */
  set value(data: number | BigInteger | Hex) {
    if (data instanceof Hex) {
      this.hex = data;
    } else {
      this._value = data;
      if (this.view) this.view.setNumber(this._value);
    }
  }

  /**
   * Gets hex from type language number
   * @returns {Hex} Hex string
   */
  get hex(): Hex {
    if (this.view) return this.view.getHex(undefined, undefined, true);
    return new Hex();
  }

  /**
   * Sets hex to type language number
   * @param {Hex} Hex Hex-string to set
   */
  set hex(hex: Hex) {
    this.value = BigInt(hex.toString(), 16);
  }
}
