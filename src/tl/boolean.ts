// @flow

import TLAbstract from './abstract';
import { Bytes } from '../serialization';

const TL_TRUE = 'b5757299';
const TL_FALSE = '379779bc';

/** TLBoolean is a param constructor view for message buffer */
export default class TLBoolean extends TLAbstract {
  /**
   * Acceptable types
   * @static
   */
  static ValidTypes = ['Bool', 'true'];

  /** Type language notation name */
  _: string = 'Bool';

  /** Stored value */
  value: boolean = false;

  /**
   * Creates type language boolean constructor
   */
  constructor(predicate: string, data: any = null, isOptional: boolean = false) {
    super();

    this.isOptional = isOptional;
    this._ = predicate;

    if (data) this.value = data;
  }

  /**
   * Gets byte size
   */
  get byteSize(): number {
    return this.isOptional && this._ === 'true' ? 0 : 4;
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

    if (this.byteSize > 0) {
      this.buf = buf.slice(offset, offset + this.byteSize);
      this.value = this.buf.hex === TL_TRUE;
    }

    return offset + this.byteSize;
  }

  /**
   * Method writes part of buffer
   */
  write(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    if (this.byteSize > 0) {
      this.buf = buf.slice(offset, offset + this.byteSize);
      this.buf.hex = this.value === true ? TL_TRUE : TL_FALSE;
    }

    return offset + this.byteSize;
  }
}
