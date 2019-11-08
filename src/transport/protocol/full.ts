/* eslint-disable class-methods-use-this */
// @flow

import { TransportProtocol } from '../../interfaces';
import crc32 from '../../utils/crc32';
import {
  Hex, MessagePlain, MessageEncrypted, GenericBuffer,
} from '../../serialization';

/**
 * Full MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#full
 */
export default class Full implements TransportProtocol {
  /**
   * Protocol header
   */
  header = new Hex('11');

  /**
   * TCP Out Sequence Number
   */
  seqOut = 0;

  /**
   * TCP In Sequence Number
   */
  seqIn = 0;

  /**
   * Wraps type language message at envelope
   * @param {MessagePlain | MessageEncrypted} payload Input message to envlope
   * @returns {Hex} Result data to send
   */
  wrap(payload: MessagePlain | MessageEncrypted): Hex {
    const len = new Hex((payload.buf.byteLength + 12).toString(16)).reverseBytes().toFixedBytes(4);
    const seq = new Hex(this.seqOut.toString(16)).reverseBytes().toFixedBytes(4);
    const data = Hex.concat(len, seq, payload.toHex());
    const crc = new Hex(crc32(data.toRawString()).toString(16)).toFixedBytes(4);

    this.seqOut += 1;

    return Hex.concat(data, crc);
  }

  /**
   * Unwraps incoming bytes to type language message
   * @param {Hex} buf Input bytes
   * @returns {MessagePlain | MessageEncrypted} Result data
   */
  unWrap(data: Hex): MessagePlain | MessageEncrypted | null {
    const envelopedData = new GenericBuffer(data.toBuffer());

    const tlen = envelopedData.view.getNumber(0, 4) as number;
    const seq = envelopedData.view.getNumber(4, 8);
    const crc = envelopedData.view.getNumber(tlen - 4, 4) as number;
    const dataWithoutCRC = envelopedData.view.getHex(0, tlen - 4);
    const len = tlen - 12;

    // eslint-disable-next-line no-console
    if (seq !== this.seqIn) console.warn('Invalid seq_no for incoming message');
    if (crc !== crc32(dataWithoutCRC.toRawString())) throw new Error('Invalid CRC for incoming message');

    // len = len % 16 === 8 ? len : len - 16 + (len % 16);
    // len = len % 16 === 0 ? len + 8 : len;

    if (len > 8) {
      const authKeyID = envelopedData.view.getNumber(8, len);
      const messageHex = envelopedData.view.getHex(8, len);

      // eslint-disable-next-line eqeqeq
      if (authKeyID == 0) {
        return new MessagePlain(messageHex.toBuffer());
      }

      return new MessageEncrypted(messageHex.toBuffer());
    }

    return null;
  }
}
