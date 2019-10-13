/* eslint-disable no-mixed-operators */
// @flow

import type { Message } from '../interfaces';
import GenericBuffer from './genericBuffer';
import Hex from './hex';
import getTime from '../utils/timer';

/**
 * MessageData is a generic buffer with 28 byte padding, which should be encrypted.
 * Ref: https://core.telegram.org/mtproto/description#encrypted-message-encrypted-data
 */
export default class MessageData extends GenericBuffer implements Message {
  constructor(source: any) {
    const bytePaddingBefore = 32;
    let bytePaddingAfter = 0;
    let payloadLength = 0;

    if (source.byteLength) payloadLength = source.byteLength;
    if (source.payloadLength) payloadLength = source.payloadLength;
    if (typeof source === 'number') payloadLength = source;

    if (payloadLength && !source.byteOffset) {
      bytePaddingAfter = ((payloadLength % 16) > 4 ? 32 : 16) - (payloadLength % 16); // + Math.floor(Math.random() * 20) * 16;
    }

    if (typeof source === 'object' && source.payloadLength) {
      super(source.toHex(), bytePaddingBefore, bytePaddingAfter);
    } else {
      super(source, bytePaddingBefore, bytePaddingAfter);
    }
  }

  /**
   * Method sets first 8 bytes with salt header
   * @param {string} salt Salt
   */
  setSalt(salt: string) {
    this.view.setHex(new Hex(salt), 0, 8);
  }

  /**
   * Method sets second 8 bytes with session_id header
   * @param {string} sessionID Session ID
   */
  setSessionID(sessionID: string) {
    this.view.setHex(new Hex(sessionID), 8, 8);
  }

  /**
   * Method generates messageID and set it to the 16-24 bytes
   * @param {Hex} msgID For skipping generating and setting manualy
   */
  setMessageID(msgID?: Hex) {
    if (msgID) {
      this.view.setHex(msgID, 16, 8);
    } else {
      const time = getTime();
      const random = Math.floor(Math.random() * 0xFFFF);

      // eslint-disable-next-line no-bitwise
      const messageID = time.second.toString(16) + `00000000${(time.nanosecond << 21 | random << 3 | 4).toString(16)}`.slice(-8);

      this.view.setHex(new Hex(messageID), 16, 8, true);
    }
  }

  /**
   * Method gets messageID from the 16-24 bytes
   * @returns {Hex} Message ID
   */
  getMessageID(): Hex {
    return this.view.getHex(16, 8);
  }

  /**
   * Method sets 24-28 bytes with seq_no header
   * @param {string} seqNum Sequence Number
   */
  setSequenceNum(seqNum: number) {
    this.view.setNumber(seqNum, 24, 4);
  }

  /**
   * Method sets 28-32 bytes with message_data_length
   */
  setLength() {
    this.view.setNumber(this.payloadLength, 28, 4);
  }

  /**
   * Method sets padding bytes with random data
   */
  setPadding() {
    this.view.setHex(Hex.random(this.bytePaddingAfter), this.bytePaddingBefore + this.payloadLength, this.bytePaddingAfter);
  }
}
