// @flow

/** Hex is a string with byte hex codes */
export default class Hex extends String {
  /* Flag shows difference between String and Hex */
  isHex: boolean = true;

  /**
   * @constructs
   * Hex can be made from string
   */
  constructor(str?: string) {
    if (str) {
      super(str.length % 2 === 1 ? `0${str}` : str);
    } else {
      super();
    }
  }

  /**
   * Returns hex string byte number.
   * @returns {number} Length in bytes
   */
  get byteLength() {
    return super.length / 2;
  }

  /**
   * Returns single byte by position.
   * @param {number} pos Byte position
   * @returns {number} Byte at position
   */
  byteAt(pos: number): number {
    return parseInt(this.slice(pos * 2, pos * 2 + 2), 16);
  }

  /**
   * Returns byte slice
   * @param {number} offset Byte position at start
   * @param {number} start Byte position at end
   * @returns {Hex} Hex string
   */
  sliceBytes(start: number, end: number): Hex {
    return new Hex(super.slice(start * 2, end * 2));
  }

  /**
   * Returns array buffer
   * @returns {ArrayBuffer} Buffer
   */
  toBuffer(): ArrayBuffer {
    const buf = new Uint8Array(this.byteLength);

    for (let i = 0; i < this.byteLength; i += 1) {
      buf[i] = this.byteAt(i);
    }

    return buf.buffer;
  }

  /**
   * Returns a raw string from bytes
   * @returns {string} Raw String
   */
  toRawString(): string {
    const bytes = [];

    for (let i = 0; i < this.byteLength; i += 1) {
      bytes.push(this.byteAt(i));
    }

    return String.fromCharCode(...bytes);
  }


  /**
   * @static
   * Returns hex string by byte codes
   * @param {number[]} bytes Byte codes
   * @returns {Hex} Hex string from bytes
   */
  static fromCharCode(...bytes: number[]): Hex {
    let str = '';

    for (let i = 0; i < bytes.length; i += 1) str += `0${bytes[i].toString(16)}`.slice(-2);

    return new Hex(str);
  }

  /**
   * @static
   * Returns random hex string
   * @param {number} byteLength Length of random string
   * @returns {Hex} Random hex string
   */
  static random(byteLength: number): Hex {
    let str = '';

    for (let i = 0; i < byteLength; i += 1) str += `0${Math.floor(Math.random() * 255).toString(16)}`.slice(-2);

    return new Hex(str);
  }
}
