import { Bytes } from '../serialization';
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
  _value: string = '';

  length: number = 0;
  padLength: number = 0;

  get value() {
    if (this.buf && !this._value) {
      if (this._ === 'string') {
        try {
          this.value = decodeURIComponent(escape(this.buf.slice(this.padLength, this.padLength + this.length).raw));
        } catch (e) {
          throw new Error(`Unable to decode string value: ${e.toString()}`);
        }
      } else {
        this.value = this.buf.slice(this.padLength, this.padLength + this.length).raw;
      }
    }
    return this._value;
  }

  get buffer() {
    if (this.buf) {
      return this.buf.slice(this.padLength, this.padLength + this.length);
    }

    return undefined;
  }

  set value(data: string) {
    this._value = data;
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
  read(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    const fb = buf.buffer[offset];
    let tlen = 0;
    let len = 0;

    if (fb < 0xFE) {
      len = fb;
      tlen = 1;
    } else {
      len = buf.slice(offset + 1, offset + 4).uint as number;
      tlen = 4;
    }

    this.padLength = tlen;
    this.length = len;

    this._byteSize = tlen + len;
    if (this._byteSize % 4) this._byteSize += 4 - (this._byteSize % 4);

    this.buf = buf.slice(offset, offset + this._byteSize);

    return offset + this._byteSize;
  }

  /**
   * Method writes part of buffer
   */
  write(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    let tlen = 0;
    let len = 0;
    let unescaped = '';

    if (this._ === 'string') {
      unescaped = unescape(encodeURIComponent(this.value));
      len = this.value ? unescaped.length : 0;
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

    this.buf = buf.slice(offset, offset + this._byteSize);

    if (tlen === 1) {
      this.buf.slice(0, 1).uint = len;
    } else {
      this.buf.slice(0, 1).uint = 0xFE;
      this.buf.slice(1, 4).uint = len;
    }

    if (this._ === 'string') {
      this.buf.slice(tlen, tlen + len).raw = unescaped;
    } else {
      this.buf.slice(tlen, tlen + len).raw = this.value;
    }

    return offset + this._byteSize;
  }
}
