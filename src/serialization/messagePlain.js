/* eslint-disable no-mixed-operators */
// @flow

import type { Message } from '../interfaces';
import GenericBuffer from './genericBuffer';
import Hex from './hex';
import getTime from '../utils/timer';

/**
 * MessagePlain is a generic buffer with 20 byte padding, which should not be encrypted.
 * Ref: https://core.telegram.org/mtproto/description#unencrypted-message
 */
export default class MessagePlain extends GenericBuffer implements Message {
  constructor(source: any) {
    const bytePaddingBefore = 20;

    if (typeof source === 'object' && source.payloadLength) {
      super(source.toHex(), bytePaddingBefore);
    } else {
      super(source, bytePaddingBefore);
    }
  }


  /**
   * Method generates message identificator and set it to the 8-16 bytes
   * @param {Hex} msgID For skipping generating and setting manualy
   * @returns {MessagePlain} Message itself
   */
  setMessageID(msgID?: Hex): MessagePlain {
    if (msgID) {
      this.view.setHex(msgID, 8, 8, true);
    } else {
      this.view.setHex(MessagePlain.GenerateID(), 8, 8, true);
    }

    return this;
  }

  /**
   * Method sets 16-20 bytes with message_data_length
   * @returns {MessagePlain} Message itself
   */
  setLength(): MessagePlain {
    this.view.setNumber(this.payloadLength, 16, 4);

    return this;
  }

  /**
   * Method sets authorization key to the first 8 bytes
   * @param {Hex} authKeyID Auth Key ID
   * @returns {MessagePlain} Message itself
   */
  setAuthKey(authKeyID: Hex) {
    this.view.setHex(authKeyID, 0, 8);

    return this;
  }

  /**
   * Method gets message identificatorfrom the 16-24 bytes
   * @returns {Hex} Message ID
   */
  getMessageID(): Hex {
    return this.view.getHex(8, 8, true);
  }

  /**
   * Generates unique message identificator depending on current time
   * @returns {Hex} Message identificator
   * @static
   */
  static GenerateID(): Hex {
    const time = getTime();

    return new Hex(time.second.toString(16) + `0000${(time.nanosecond << 20 | time.nanosecond << 8 | 4).toString(16)}`.slice(-8));
    // return new Hex(`${(time.second + time.nanosecond / 1000).toString(16).replace('.', '')}04`);
  }
}
