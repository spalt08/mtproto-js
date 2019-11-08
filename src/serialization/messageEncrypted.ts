// @flow

import GenericBuffer from './genericBuffer';
import Hex from './hex';

/**
 * MessageEncrypted is a generic buffer with 24 byte padding, which has been encrypted.
 * Ref: https://core.telegram.org/mtproto/description#encrypted-message
 */
export default class MessageEncrypted extends GenericBuffer {
  constructor(source: any) {
    const bytePaddingBefore = 24;
    super(source, bytePaddingBefore);
  }

  /**
   * Method sets authKey to the first 8 bytes
   * @param {Hex} authKeyID Auth Key ID
   */
  setAuthKey(authKeyID: Hex) {
    this.view.setHex(authKeyID, 0, 8);
  }

  /**
   * Method sets 8-24 bytes with msg_key
   * @param {Hex} msgKey Message Key
   */
  setMsgKey(msgKey: Hex) {
    this.view.setHex(msgKey, 8, 16);
  }

  /**
   * Method gets hex string from 8-24 bytes
   * @return {Hex} Message Key
   */
  getMsgKey() {
    return this.view.getHex(8, 16);
  }

  /**
   * Method sets encrypted_data from 24 byte
   * @param {Hex} encryptedData Payload Data
   */
  setData(encryptedData: Hex) {
    this.view.setHex(encryptedData, 24);
  }

  /**
   * Method gets encrypted_data starts 24 byte
   * @return {Hex} Payload Data
   */
  getData() {
    return this.view.getHex(24, this.payloadLength);
  }
}
