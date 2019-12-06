/**
 * Wrapper for handling array buffers, views and hex strings
 */
export default class Bytes {
  // Array Buffer
  buffer: Uint8Array;

  /**
   * Creates new Bytes object from:
   * - AraryBuffer
   * - UInt8Array
   * - Hex-string
   */
  constructor(src: unknown, start?: number, end?: number) {
    if (src instanceof Uint8Array) {
      let offset = src.byteOffset;
      let len = src.byteLength;

      if (end) len = end;
      if (start) offset += start;
      if (start) len -= start;

      this.buffer = new Uint8Array(src.buffer, offset, len);
      return;
    }

    if (src instanceof ArrayBuffer) {
      let offset = 0;
      let len = src.byteLength;

      if (end) len = end;
      if (start) offset += start;
      if (start) len -= start;

      this.buffer = new Uint8Array(src, offset, len);
      return;
    }

    if (typeof src === 'number') {
      this.buffer = new Uint8Array(src);
      return;
    }

    throw new Error(`Unable to create bytes from ${src}`);
  }

  /**
   * Gets length
   */
  get length(): number {
    return this.buffer.byteLength;
  }

  /**
   * Gets string encoded as hex
   */
  get hex(): string {
    let str = ''; let byte;

    for (let i = 0; i < this.length; i += 1) {
      byte = this.buffer[i];
      str += (byte < 16 ? '0' + byte.toString(16) : byte.toString(16));
    }

    return str;
  }

  /**
   * Sets string encoded as hex
   */
  set hex(str: string) {
    const normalized = str.length % 2 === 1 ? `0${str}` : str;
    for (let i = 0; i < this.length * 2; i += 2) {
      this.buffer[i / 2] = i + 2 <= normalized.length ? +`0x${normalized.slice(i, i + 2)}` : 0;
    }
  }

  /**
   * Gets string encoded as hex (little-endian)
   */
  get lhex(): string {
    let str = ''; let byte;

    for (let i = 0; i < this.length; i += 1) {
      byte = this.buffer[i];
      str = (byte < 16 ? '0' + byte.toString(16) : byte.toString(16)) + str;
    }

    return str;
  }

  /**
   * Sets string encoded as hex (little-endian)
   */
  set lhex(str: string) {
    const normalized = str.length % 2 === 1 ? `0${str}` : str;
    for (let i = 0; i < this.length * 2; i += 2) {
      this.buffer[this.length - i / 2 - 1] = i + 2 <= normalized.length ? +`0x${normalized.slice(i, i + 2)}` : 0;
    }
  }

  /**
   * Gets raw string
   */
  get raw(): string {
    return String.fromCharCode.apply(null, [].slice.call(this.buffer));
  }

  /**
   * Sets raw string
   */
  set raw(str: string) {
    for (let i = 0; i < this.length; i += 1) {
      this.buffer[i] = i < str.length ? str.charCodeAt(i) : 0;
    }
  }

  /**
   * Gets integer in little endian order
   */
  get uint(): number | string {
    if (this.length > 4) {
      return this.lhex;
    }

    let out = 0;

    for (let i = 0; i < this.length; i += 1) {
      out ^= this.buffer[i] << (8 * i);
    }

    return out;
  }

  /**
   * Sets integer in little endian order
   */
  set uint(data: number | string) {
    if (typeof data === 'string') {
      this.lhex = data;
    } else {
      for (let i = 0; i < this.length; i += 1) {
        this.buffer[i] = (data >> 8 * i) & 0xFF;
      }
    }
  }

  /**
   * Gets unsigned integer in little endian order
   * Limited for 32 bit.
   */
  get int32(): number {
    if (this.length > 4) throw new Error('Unsigned ints can be parsed from 4 byte only');

    const view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    return view.getInt32(0, true);
  }

  /**
   * Sets unsigned integer in little endian order
   * Limited for 32 bit.
   */
  set int32(data: number) {
    if (this.length > 4) throw new Error('Unsigned ints can be parsed from 4 byte only');

    const view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    view.setInt32(0, data, true);
  }

  /**
   * Debug
   */
  // get next() {
  //   return new Bytes(new Uint8Array(this.buffer.buffer, this.buffer.byteOffset + 8, 8));
  // }

  /**
   * Creates new Bytes object pointed to same array buffer
   */
  slice(start?: number, end?: number): Bytes {
    return new Bytes(this.buffer, start, end);
  }

  /**
   * Creates new reversed bytes object
   */
  reverse(): Bytes {
    const buf = new Bytes(this.length);

    for (let i = 0; i < this.length; i += 1) {
      buf.buffer[this.length - i - 1] = this.buffer[i];
    }

    return buf;
  }

  /**
   * Randomize bytes
   */
  randomize(): Bytes {
    if (window && window.crypto && crypto.getRandomValues) {
      crypto.getRandomValues(this.buffer);
    } else {
      for (let i = 0; i < this.length; i += 1) {
        this.buffer[i] = Math.ceil(Math.random() * 255);
      }
    }

    return this;
  }

  /**
   * @static
   * Returns xor of two bytes strings
   */
  static xor(left: Bytes, right: Bytes): Bytes {
    const bytes = new Bytes(left.length);

    for (let i = 0; i < left.length; i += 1) {
      bytes.buffer[i] = left.buffer[i] ^ right.buffer[i];
    }

    return bytes;
  }
}
