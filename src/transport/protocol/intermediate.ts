/* eslint-disable class-methods-use-this */
// @flow

import {
  Hex, MessagePlain, MessageEncrypted, GenericBuffer,
} from '../../serialization';

/**
 * Intermediate MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#intermediate
 */
export default class Intermediate {
  /**
   * Protocol header
   */
  header: Hex = new Hex('eeeeeeee');

  /**
   * Wraps type language message at envelope
   * @param {MessagePlain | MessageEncrypted} payload Input message to envlope
   * @returns {Hex} Result data to send
   */
  wrap(payload: MessagePlain | MessageEncrypted): Hex {
    const len = payload.buf.byteLength;
    const lenBytes = Hex.concat(new Hex(len.toString(16)).reverseBytes(), new Hex('00'.repeat(3))).sliceBytes(0, 4);
    const envelopedData = Hex.concat(lenBytes, payload.toHex());

    return envelopedData;
  }


  /**
   * Unwraps incoming bytes to type language message
   * @param {Hex} buf Input bytes
   * @returns {MessagePlain | MessageEncrypted} MTProto message
   */
  unWrap(data: Hex): MessagePlain | MessageEncrypted | null {
    const envelopedData = new GenericBuffer(data.toBuffer());

    let len = envelopedData.view.getNumber(0, 4) as number;

    len = len % 16 === 8 ? len : len - 16 + (len % 16);
    len = len % 16 === 0 ? len + 8 : len;

    if (len > 8) {
      const authKeyID = envelopedData.view.getNumber(4, 8);
      const messageHex = envelopedData.view.getHex(4, len);

      // eslint-disable-next-line eqeqeq
      if (authKeyID == 0) {
        return new MessagePlain(messageHex.toBuffer());
      }

      return new MessageEncrypted(messageHex.toBuffer());
    }

    return null;
  }
}
