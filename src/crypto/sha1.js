// @flow

import Rusha from 'rusha';

/**
 * Class SHA1 is an abstract adapter for third-party sha1 implementation.
 * Benchmark: https://dominictarr.github.io/crypto-bench/
 */

export default class SHA1 {
  /**
   * @static
   * Base function for calculating sha1(hex-string)
   *
   * @param {string} str A hex string for hashing
   * @returns {string} Result sha1 hash
   */
  static Hex(hex: string): string {
    return Rusha.createHash().update(hex, 'hex').digest('hex');
  }

  /**
   * @static
   * Base function for calculating sha1(ArrayBuffer)
   *
   * @param {string} buf An input byte buffer
   * @returns {string} Result sha1 hash
   */
  static Buffer(buf: ArrayBuffer): string {
    return Rusha.createHash().update(buf).digest('hex');
  }
}
