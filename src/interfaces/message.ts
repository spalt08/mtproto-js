import { Hex } from '../serialization';

/** Represents unencrypted, decrypted and plain type language serialized messages */
export interface Message {
  /**
   * Method converts message to native array buffer
   * @returns {ArrayBuffer} Native array buffer
   */
  getBuffer(): ArrayBuffer;

  /**
   * Gets message identificator
   * @returns {Hex} 64-bit hex string
   */
  getMessageID(): Hex;

  /**
   * Converts buffer to hex string
   * @returns {Hex} Hex string
   */
  toHex(): Hex;
}
