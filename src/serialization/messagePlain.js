/* eslint-disable no-mixed-operators */
// @flow

import GenericBuffer from './genericBuffer';
import Hex from './hex';
import getTime from '../utils/timer';

/**
 * MessagePlain is a generic buffer with 20 byte padding, which should not be encrypted.
 * Ref: https://core.telegram.org/mtproto/description#unencrypted-message
 */
export default class MessagePlain extends GenericBuffer {
  constructor(source: any) {
    const bytePaddingBefore = 20;

    if (typeof source === 'object' && source.payloadLength) {
      super(source.toHex(), bytePaddingBefore);
    } else {
      super(source, bytePaddingBefore);
    }
  }

  /**
   * Method generates messageID and set it to the 8-16 bytes
   */
  setMessageID() {
    const time = getTime();
    const random = Math.floor(Math.random() * 0xFFFF);

    // eslint-disable-next-line no-bitwise
    const messageID = time.second.toString(16) + `00000000${(time.nanosecond << 21 | random << 3 | 4).toString(16)}`.slice(-8);

    this.view.setHex(new Hex(messageID), 8, 8, true);
  }


  /**
   * Method sets 16-20 bytes with message_data_length
   */
  setLength() {
    this.view.setNumber(this.payloadLength, 16, 4);
  }
}
