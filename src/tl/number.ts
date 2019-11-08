import { BigInteger } from 'big-integer';
import { Bytes } from '../serialization';
import TLAbstract from './abstract';

/**
 * Type language number represents any of number constructors in type language
 * @extends TLAbstract
 */
export default class TLNumber extends TLAbstract {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = [
    'int', 'int64', 'int128', 'int256', 'long',
  ];

  /** Stored value */
  value: number | BigInteger = 0;

  /**
   * Creates new type language number
   * @constructs
   */
  constructor(predicate: string, data?: number | BigInteger) {
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
   * Method reads part of buffer
   */
  read(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    this.buf = buf.slice(offset, offset + this.byteSize);
    this.value = this.buf.uint;

    return offset + this.byteSize;
  }

  /**
   * Method writes part of buffer
   */
  write(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    this.buf = buf.slice(offset, offset + this.byteSize);
    this.buf.uint = this.value;

    return offset + this.byteSize;
  }
}
