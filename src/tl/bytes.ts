import { Reader32, Writer32 } from '../serialization';
import TLAbstract from './abstract';

/**
 * Type language bytes represents any of string or bytes constructors
 * @extends TLAbstract
 */
export default class TLBytes extends TLAbstract {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = [
    'bytes', 'string',
  ];

  /** Type language notation name */
  _: string = 'bytes';

  /** Stored value */
  value: any = ''; // string | ArrayBuffer = '';

  length: number = 0;
  padLength: number = 0;

  get buffer() {
    if (this.buf) {
      return this.buf.slice(this.padLength, this.padLength + this.length);
    }

    return undefined;
  }

  /**
   * Creates TLString object from data
   */
  constructor(predicate: string, data?: string) {
    super();

    this._ = predicate;
    if (data) {
      this.value = data;
    }
  }

  /**
   * Gets byte size
   */
  get byteSize(): number {
    let tlen = 0;
    let len = 0;

    if (this._ === 'string') {
      len = typeof this.value === 'string' ? unescape(encodeURIComponent(this.value)).length : 0;
    } else {
      len = this.value.length || 0;
    }

    if (len < 0xFE) {
      tlen = 1;
    } else {
      tlen = 4;
    }

    this._byteSize = tlen + len;
    if (this._byteSize % 4) this._byteSize += 4 - (this._byteSize % 4);

    return this._byteSize;
  }

  /**
   * Sets byte size
   */
  set byteSize(size: number) {
    this._byteSize = size;
  }

  /**
   * Method reads part of buffer
   */
  read(reader: Reader32) {
    if (this._ === 'string') this.value = reader.string();
    else this.value = reader.bytes();
  }

  /**
   * Method writes part of buffer
   */
  write(writer: Writer32) {
    if (this._ === 'string') writer.string(this.value);
    else writer.bytes(this.value);
  }
}
