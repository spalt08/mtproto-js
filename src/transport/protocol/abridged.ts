/* eslint-disable class-methods-use-this */
// @flow

import {
  Hex, MessagePlain, MessageEncrypted, GenericBuffer,
} from '../../serialization';

/**
 * Abridged MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#abridged
 */
export default class Abridged {
  /**
   * Protocol header
   */
  header: Hex = new Hex('ef');

  /**
   * Wraps type language message at envelope
   * @param {MessagePlain | MessageEncrypted} payload Input message to envlope
   * @returns {Hex} Result data to send
   */
  wrap(payload: MessagePlain | MessageEncrypted): Hex {
    const len = payload.buf.byteLength >> 2;
    let lenBytes = new Hex(len.toString(16));

    if (len >= 127) {
      lenBytes = Hex.concat(new Hex('7f'), lenBytes.reverseBytes(), new Hex('00'.repeat(3))).sliceBytes(0, 4);
    }

    return Hex.concat(lenBytes, payload.toHex());
  }

  /**
   * Unwraps incoming bytes to type language message
   * @param {Hex} buf Input bytes
   * @returns {MessagePlain | MessageEncrypted} Result data
   */
  unWrap(data: Hex): MessagePlain | MessageEncrypted | null {
    const envelopedData = new GenericBuffer(data.toBuffer());

    let payloadOffset = 1;
    let len = envelopedData.view.getNumber(0, 1) as number;

    if (len === 127) {
      payloadOffset = 4;
      len = envelopedData.view.getNumber(1, 3) as number;
    }

    len <<= 2;

    if (len > 8) {
      const authKeyID = envelopedData.view.getNumber(payloadOffset, 8);

      // eslint-disable-next-line eqeqeq
      if (authKeyID == 0) {
        const messageHex = envelopedData.view.getHex(payloadOffset, len);
        return new MessagePlain(messageHex.toBuffer());
      }

      len = len % 16 === 8 ? len : len - 16 + (len % 16);
      len = len % 16 === 0 ? len + 8 : len;

      const messageHex = envelopedData.view.getHex(payloadOffset, len);
      return new MessageEncrypted(messageHex.toBuffer());
    }

    return null;
  }
}
