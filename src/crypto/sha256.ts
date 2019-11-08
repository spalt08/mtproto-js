import { Hex } from '../serialization';
import forge from '../vendor/forge-sha256';

/**
 * Class SHA256 is an abstract adapter for third-party sha256 implementation.
 * Benchmark: https://dominictarr.github.io/crypto-bench/
 */

export default class SHA256 {
  /**
   * Base function for calculating sha256(hex-string)
   *
   * @param {Hex} str A hex string for hashing
   * @returns {Hex} Result sha256 hash
   */
  static Hex(hex: Hex): Hex {
    return new Hex(forge.md.sha256.create().update(hex.toRawString()).digest().toHex());
  }

  /**
   * Base function for calculating sha1(ArrayBuffer)
   *
   * @param {string} buf An input byte buffer
   * @returns {string} Result sha256 hash
   */
  static Buffer(buf: ArrayBuffer): string {
    return forge.md.sha256.create().update(buf).digest().toHex();
  }
}
