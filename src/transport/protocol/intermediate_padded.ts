/* eslint-disable class-methods-use-this */
import { Bytes } from '../../serialization';

/**
 * Padded Intermediate MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#padded-intermediate
 */
export default class IntermediatePadded {
  /**
   * Protocol header
   */
  header = 'dddddddd';

  /**
   * Wraps type language message at envelope
   */
  wrap(payload: Bytes): Bytes {
    const len = payload.length;
    const plen = Math.floor(Math.random() * 15);
    const tlen = len + plen;

    const enveloped = new Bytes(4 + tlen);

    enveloped.slice(0, 4).int32 = tlen;
    enveloped.slice(4, 4 + len).raw = payload.raw;
    enveloped.slice(4 + len).randomize();

    return enveloped;
  }

  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): [string, Bytes] {
    let tlen = data.slice(0, 4).int32;

    if (tlen < 8) throw new Error(`Unexpected frame: ${data.hex}`);

    if (data.slice(4, 12).uint === '0000000000000000') {
      return ['plain', data.slice(4)];
    }

    // todo: quick ack
    tlen = tlen % 16 === 8 ? tlen : tlen - 16 + (tlen % 16);
    tlen = tlen % 16 === 0 ? tlen + 8 : tlen;

    return ['encrypted', data.slice(4, 4 + tlen)];
  }
}
