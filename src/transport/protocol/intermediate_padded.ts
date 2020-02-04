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
  unWrap(data: Bytes): Bytes {
    const len = data.slice(0, 4).int32;
    return data.slice(4, 4 + len - (len % 16));
  }
}
