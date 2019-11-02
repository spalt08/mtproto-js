/* eslint-disable no-bitwise */
// @flow

/** Hex is a string with byte hex codes */
export default class Hex extends String {
  /* Flag shows difference between String and Hex */
  isHex: boolean = true;

  /**
   * Creates hex
   * @params
   */
  constructor(str?: any | string | Hex) {
    if (typeof str === 'object' && str instanceof Hex) {
      return str;
    }

    if (str && typeof str === 'string') {
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
    return this.length / 2;
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
  sliceBytes(start: number, end?: number): Hex {
    if (end) {
      return new Hex(this.slice(start * 2, end * 2));
    }

    return new Hex(this.slice(start * 2));
  }

  /**
   * Returns reversed by bites hex string
   * @returns {Hex} Hex string
   */
  reverseBytes(): Hex {
    let revStr = '';

    for (let i = this.byteLength - 1; i >= 0; i -= 1) revStr += this.sliceBytes(i, i + 1).toString();

    return new Hex(revStr);
  }

  /**
   * Returns hex padded by extra bytes
   * @param {number} byteNum Number of output bytes
   * @returns {Hex} Hex string
   */
  toFixedBytes(byteNum: number): Hex {
    if (byteNum > this.byteLength) {
      return Hex.concat(this, new Hex('00'.repeat(byteNum - this.byteLength)));
    }

    return this;
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
  static fromCharCode(...bytes: number[]): any {
    let str = '';

    for (let i = 0; i < bytes.length; i += 1) str += `0${bytes[i].toString(16)}`.slice(-2);

    return new Hex(str);
  }

  /**
   * @static
   * Converts raw string bytes to Hex
   * @param {string} str Input string
   * @returns {Hex} hex-string
   */
  static fromRawString(str: string): Hex {
    const bytes = [];

    for (let i = 0; i < str.length; i += 1) {
      bytes.push(str.charCodeAt(i));
    }

    return Hex.fromCharCode(...bytes);
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

  /**
   * @static
   * Returns xor of two hex strings
   * @param {Hex} left Left string
   * @param {Hex} right Right string
   * @returns {Hex} Result of xor
   */
  static xor(left: Hex, right: Hex): Hex {
    const bytes = [];

    for (let i = 0; i < left.byteLength; i += 1) {
      bytes.push(left.byteAt(i) ^ right.byteAt(i));
    }

    return Hex.fromCharCode(...bytes);
  }

  /**
   * @static
   * Returns concatenante of two hex strings
   * @param {Hex[]} hexes Hex trings
   * @returns {Hex} Result of concat
   */
  static concat(...hexes: Hex[]): Hex {
    let str = '';

    for (let i = 0; i < hexes.length; i += 1) str += hexes[i].toString();

    return new Hex(str);
  }
}
