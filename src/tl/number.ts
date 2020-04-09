import { Reader32, Writer32 } from '../serialization';
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
    'int', 'int64', 'int128', 'int256', 'long', 'double',
  ];

  /** Stored value */
  value: number | string = 0;

  /**
   * Creates new type language number
   * @constructs
   */
  constructor(predicate: string, data?: number | string) {
    super();

    this._ = predicate;

    switch (predicate) {
      case 'int': this.byteSize = 4; break;
      case 'int64': this.byteSize = 8; break;
      case 'int128': this.byteSize = 16; break;
      case 'int256': this.byteSize = 32; break;
      case 'long': this.byteSize = 8; break;
      // todo double read / write
      case 'double': this.byteSize = 8; break;
      default:
        throw new Error(`TypeLanguage: Unknown number ${predicate}`);
    }

    if (data) this.value = data;
  }

  /**
   * Method reads part of buffer
   */
  read(reader: Reader32) {
    switch (this._) {
      case 'int': this.value = reader.int32(); break;
      case 'int64': this.value = reader.int64(); break;
      case 'int128': this.value = reader.int128() as any; break;
      case 'int256': this.value = reader.int256() as any; break;
      case 'long': this.value = reader.long(); break;
      case 'double': this.value = reader.double(); break;
      default:
        throw new Error(`TypeLanguage: Unknown number ${this._}`);
    }
  }

  /**
   * Method writes part of buffer
   */
  write(writer: Writer32) {
    switch (this._) {
      case 'int': writer.int32(this.value as number); break;
      case 'int64': writer.int64(this.value as string); break;
      case 'int128': writer.int128(this.value as any); break;
      case 'int256': writer.int256(this.value as any); break;
      case 'long': writer.long(this.value as string); break;
      case 'double': writer.long(this.value as string); break;
      default:
        throw new Error(`TypeLanguage: Unknown number ${this._}`);
    }
  }
}
