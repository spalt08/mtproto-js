import { Bytes } from '../serialization';

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
  read(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    if (this.byteSize > 0) {
      this.buf = buf.slice(offset, offset + this.byteSize);
      this.value = this.buf.raw;
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
      this.buf.raw = this.value;
    }

    return offset + this.byteSize;
  }

  /**
   * Checks if constructor has any value
   */
  hasValue(): boolean {
    return this.value !== '';
  }

  /**
   * Shortcut for getting value
   */
  json(): string {
    return this.value;
  }
}
