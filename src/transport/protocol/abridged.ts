/* eslint-disable class-methods-use-this */
import { Bytes } from '../../serialization';

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
  wrap(payload: Bytes): Bytes {
    const len = payload.length >> 2;

    if (len >= 0x7F) {
      const enveloped = new Bytes(4 + payload.length);
      enveloped.slice(0, 1).uint = 0x7F;
      enveloped.slice(1, 4).uint = len;
      enveloped.slice(4).raw = payload.raw;

      return enveloped;
    }

    const enveloped = new Bytes(1 + payload.length);
    enveloped.slice(0, 1).uint = len;
    enveloped.slice(1).raw = payload.raw;

    return enveloped;
  }

  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): Bytes {
    let len = data.buffer[0];
    let hlen = 1;

    if (len >= 0x7f) {
      len = data.slice(1, 4).uint as number;
      hlen = 4;
    }

    len <<= 2;

    return data.slice(hlen, hlen + len);
  }
}
