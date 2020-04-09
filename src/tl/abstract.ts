import { Bytes, Reader32, Writer32 } from '../serialization';

/** Abstract class for any type language constructor */
export default class TLAbstract {
  /** Type language notation name */
  _: string = 'void';

  /** Represents bare types */
  isBare: boolean = true;

  /** Represents optional fields in constructor */
  isOptional: boolean = false;

  /** Index of optional field in constructor */
  flagIndex: number = 0;

  /* Adapter to buffer */
  buf: Bytes | undefined;

  /** Byte size for allocation */
  _byteSize: number = 0;

  /** Stored value */
  value: any = null;

  /**
   * Gets byte size for allocation
   */
  get byteSize() {
    return this._byteSize;
  }

  /**
   * Sets byte size for allocation
   */
  set byteSize(size: number) {
    this._byteSize = size;
  }

  /**
   * Method reads part of buffer
   */
  read(reader: Reader32) {
    if (this.buf) throw new Error('Buffer already allocated');

    if (this.byteSize > 0) {
      this.value = reader.int32();
    }
  }

  /**
   * Method writes part of buffer
   */
  write(writer: Writer32) {
    if (this.byteSize > 0) {
      writer.int32(this.value);
    }
  }

  /**
   * Checks if constructor has any value
   */
  hasValue(): boolean {
    return this.value && this.value !== '';
  }

  /**
   * Shortcut for getting value
   */
  json(): any {
    return this.value;
  }
}
