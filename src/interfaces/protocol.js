// @flow

import { MessagePlain, MessageEncrypted, Hex } from '../serialization';

export interface TransportProtocol {
  /**
   * Protocol header
   */
  header: Hex;

  /**
   * Wraps type language message at envelope
   * @param {MessagePlain | MessageEncrypted} payload Input message to envlope and obfuscate
   * @returns {ArrayBuffer} Result data to send
   */
  wrap(payload: MessagePlain | MessageEncrypted): Hex;

  /**
   * Unwraps incoming bytes to type language message
   * @param {ArrayBuffer} buf Input bytes
   * @returns {MessagePlain | MessageEncrypted | null} Result data to send
   */
  unWrap(buf: Hex): MessagePlain | MessageEncrypted | null;
}
