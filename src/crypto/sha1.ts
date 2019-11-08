import Rusha from 'rusha';
import { hex, Bytes } from '../serialization';

/**
 * Class SHA1 is an abstract adapter for third-party sha1 implementation.
 * Benchmark: https://dominictarr.github.io/crypto-bench/
 */

export default function sha1(data: Bytes): Bytes {
  return hex(Rusha.createHash().update(data.raw).digest('hex'));
}
