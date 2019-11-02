/* eslint-disable class-methods-use-this */
// @flow

import {
  Hex, MessagePlain, MessageEncrypted, GenericBuffer,
} from '../../serialization';

/**
 * Padded Intermediate MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#padded-intermediate
 */
export default class IntermediatePadded {
  /**
   * Protocol header
   */
  header: Hex = new Hex('dddddddd');

  /**
   * Wraps type language message at envelope
   * @param {MessagePlain | MessageEncrypted} payload Input message to envlope
   * @returns {Hex} Result data to send
   */
  wrap(payload: MessagePlain | MessageEncrypted): Hex {
    const padLen = Math.floor(Math.random() * 15);
    const tlen = payload.buf.byteLength + padLen;
    const lenBytes = Hex.concat(new Hex(tlen.toString(16)).reverseBytes(), new Hex('00'.repeat(3))).sliceBytes(0, 4);

    return Hex.concat(lenBytes, payload.toHex(), Hex.random(padLen));
  }

  /**
   * Unwraps incoming bytes to type language message
   * @param {Hex} data Input bytes
   * @returns {MessagePlain | MessageEncrypted} Result data to send
   */
  unWrap(data: Hex): MessagePlain | MessageEncrypted | null {
    const envelopedData = new GenericBuffer(data.toBuffer());

    const tlen = envelopedData.view.getNumber(0, 4);
    if (tlen > 8) {
      const authKeyID = envelopedData.view.getNumber(4, 8);
      const messageHex = envelopedData.view.getHex(4, tlen);

      // eslint-disable-next-line eqeqeq
      if (authKeyID == 0) {
        return new MessagePlain(messageHex.toBuffer());
      }

      return new MessageEncrypted(messageHex.toBuffer());
    }

    return null;
  }
}
