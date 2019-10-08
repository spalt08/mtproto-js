/* eslint-disable no-bitwise */
// @flow

import { Hex } from '../../serialization';

/**
 * Returns xor of two hex strings
 *
 * @param {Hex} left Left string
 * @param {Hex} right Right string
 * @returns {Hex} Result of xor
 */
export default function xor(left: Hex, right: Hex): Hex {
  const bytes = [];

  for (let i = 0; i < left.byteLength; i += 1) {
    bytes.push(left.byteAt(i) ^ right.byteAt(i));
  }

  return Hex.fromCharCode(...bytes);
}
