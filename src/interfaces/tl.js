// @flow

import { GenericView, GenericBuffer, Hex } from '../serialization';

/**
 * Represents any of type language consturctors, including:
 *   vectors, bare types, constructors, booleans, numbers, etc.
 * Ref: https://core.telegram.org/mtproto/TL
 *
 * @param {boolean} isBare Represents bare types
 * @param {boolean} isOptional Represents optional fields in constructor
 * @param {number} flagIndex Flag bit for optional types
 * @param {any} value Value of constructor
 */
export interface TLAny {
  /** Type language notation name */
  _: string;

  /** Represents bare types */
  isBare: boolean;

  /** Represents optional fields in constructor */
  isOptional: boolean;

  /** Flag bit for optional types. Default is 0 */
  flagIndex: number;

  /** Value of constructor */
  value: any;

  /** Hex value of constructor */
  hex: Hex;

  /** Data view for byte array */
  view: GenericView;

  /** Byte size for allocation */
  byteSize: number;

  /** Constructor params */
  params: { [string]: TLAny };

  /**
   * Method maps part of buffer
   * @param {GenericBuffer} buf Buffer for mapping
   * @param {number} offset Byte offset for mapping buffer
   * @returns {number} Byte offset after mapping
   */
  map(buf: GenericBuffer, offset: number): number;

  /**
   * Checks if constructor has any value
   * @returns {boolean} If constructor has any value
   */
  hasValue(): boolean;
}
