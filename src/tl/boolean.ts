// @flow

import TLAbstract from './abstract';
import { Reader32, Writer32 } from '../serialization';

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
  read(reader: Reader32) {
    if (this.byteSize > 0) {
      this.value = reader.bool();
    }
  }

  /**
   * Method writes part of buffer
   */
  write(writer: Writer32) {
    if (this.byteSize > 0) {
      writer.bool(this.value === true);
    }
  }
}
