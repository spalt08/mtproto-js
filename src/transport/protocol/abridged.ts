/* eslint-disable class-methods-use-this */
import { Bytes } from '../../serialization';
import { PlainMessage, EncryptedMessage } from '../../message';

/**
 * Abridged MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#abridged
 */
export default class Abridged {
  /**
   * Protocol header
   */
  header = 'efefefef';

  /**
   * Wraps type language message at envelope
   */
  wrap(payload: PlainMessage | EncryptedMessage): Bytes {
    const len = payload.buf.length >> 2;

    if (len >= 0x7F) {
      const enveloped = new Bytes(4 + payload.buf.length);
      enveloped.slice(0, 1).uint = 0x7F;
      enveloped.slice(1, 4).uint = len;
      enveloped.slice(4).raw = payload.buf.raw;

      return enveloped;
    }

    const enveloped = new Bytes(1 + payload.buf.length);
    enveloped.slice(0, 1).uint = len;
    enveloped.slice(1).raw = payload.buf.raw;

    return enveloped;
  }

  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): PlainMessage | EncryptedMessage {
    let len = data.buffer[0];
    let hlen = 1;

    if (len >= 0x7f) {
      len = data.slice(1, 4).uint as number;
      hlen = 4;
    }

    len <<= 2;

    if (len < 8) throw new Error(`Unexpected frame: ${data.hex}`);

    const authKeyID = data.slice(hlen, hlen + 8).uint;

    if (authKeyID.toString() === '0') {
      return new PlainMessage(data.slice(hlen));
    }

    // todo: quick ack
    len = len % 16 === 8 ? len : len - 16 + (len % 16);
    len = len % 16 === 0 ? len + 8 : len;

    return new EncryptedMessage(data.slice(hlen, hlen + len));
  }
}
