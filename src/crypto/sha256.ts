import forge from '../vendor/forge-sha256';
import { Bytes } from '../serialization';

/**
 * Adapter for third-party sha256 implementation.
 * Benchmark: https://dominictarr.github.io/crypto-bench/
 */

export default function sha256(data: string): Bytes {
  const buf = new Bytes(32);
  buf.raw = (forge as any).md.sha256.create().update(data).digest().data;

  return buf;
}
