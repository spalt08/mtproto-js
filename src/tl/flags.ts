import TLNumber from './number';

/** Represents flags handler for constructor */
export default class TLFlags extends TLNumber {
  /** Type language notation name */
  _: string = 'flags';

  /** Stored value */
  value: number = 0;

  /**
   * Creates flags handler
   */
  constructor() {
    super('int', 0);
    this.byteSize = 4;
  }

  /**
   * Tests if flag bit is set
   * @param {number} bit Bit Number
   * @returns {boolean} Result
   */
  has(bit: number): boolean {
    return (this.value & (1 << bit)) !== 0;
  }

  /**
   * Sets bit to flag
   * @param {number} bit Bit Number
   */
  set(bit: number) {
    this.value |= 1 << bit;
  }
}
