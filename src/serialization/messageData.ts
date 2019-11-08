/* eslint-disable no-mixed-operators */
// @flow

import { BigInteger } from 'big-integer';
import { Message } from '../interfaces';
import Hex from './hex';
import GenericBuffer from './genericBuffer';
import MessagePlain from './messagePlain';

/**
 * MessageData is a generic buffer with 28 byte padding, which should be encrypted.
 * Ref: https://core.telegram.org/mtproto/description#encrypted-message-encrypted-data
 */
export default class MessageData extends GenericBuffer implements Message {
  constructor(source: any = {}, isV1: boolean = false) {
    const bytePaddingBefore = 32;
    let bytePaddingAfter = 0;
    let payloadLength = 0;

    if (source.byteLength) payloadLength = source.byteLength;
    if (source.payloadLength) payloadLength = source.payloadLength;
    if (typeof source === 'number') payloadLength = source;

    if (payloadLength && !source.byteOffset) {
      bytePaddingAfter = ((payloadLength % 16) > 4 && !isV1 ? 32 : 16) - (payloadLength % 16); // + Math.floor(Math.random() * 20) * 16;
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
   * @returns {MessageData} Message itself
   */
  setSalt(salt: Hex): MessageData {
    this.view.setHex(salt, 0, 8);

    return this;
  }

  /**
   * Method sets second 8 bytes with session_id header
   * @param {string} sessionID Session ID
   * @returns {MessageData} Message itself
   */
  setSessionID(sessionID: Hex): MessageData {
    this.view.setHex(sessionID, 8, 8);

    return this;
  }

  /**
   * Method generates messageID and set it to the 16-24 bytes
   * @param {Hex} msgID For skipping generating and setting manualy
   * @returns {MessageData} Message itself
   */
  setMessageID(msgID?: Hex): MessageData {
    if (msgID) {
      this.view.setHex(msgID, 16, 8, true);
    } else {
      this.view.setHex(MessageData.GenerateID(), 16, 8, true);
    }

    return this;
  }

  /**
   * Method sets 24-28 bytes with seq_no header
   * @param {number} seqNum Sequence Number
   * @returns {MessageData} Message itself
   */
  setSequenceNum(seqNum: number): MessageData {
    this.view.setNumber(seqNum, 24, 4);

    return this;
  }

  /**
   * Method sets 28-32 bytes with message_data_length
   * @returns {MessageData} Message itself
   */
  setLength(): MessageData {
    this.view.setNumber(this.payloadLength, 28, 4);

    return this;
  }

  /**
   * Method sets padding bytes with random data
   * @returns {MessageData} Message itself
   */
  setPadding(): MessageData {
    this.view.setHex(Hex.random(this.bytePaddingAfter), this.bytePaddingBefore + this.payloadLength, this.bytePaddingAfter);

    return this;
  }

  /**
   * Method gets messageID from the 16-24 bytes
   * @returns {Hex} Message ID
   */
  getMessageID(): Hex {
    return this.view.getHex(16, 8, true);
  }

  /**
   * Method gets number from 24-28 bytes
   * @returns {number} Sequence Number
   */
  getSequenceNum(): number | BigInteger {
    return this.view.getNumber(24, 4);
  }

  /**
   * Generates unique message identificator depending on current time
   * @returns {Hex} Message identificator
   * @static
   */
  static GenerateID(): Hex {
    return MessagePlain.GenerateID();
  }
}
