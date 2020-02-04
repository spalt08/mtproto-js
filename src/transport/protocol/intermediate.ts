/* eslint-disable class-methods-use-this */
import { Bytes } from '../../serialization';

/**
 * Intermediate MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#intermediate
 */
export default class Intermediate {
  /**
   * Protocol header
   */
  header = 'eeeeeeee';

  /**
   * Wraps type language message at envelope
   */
  wrap(payload: Bytes): Bytes {
    const len = payload.length;
    const enveloped = new Bytes(4 + len);

    enveloped.slice(0, 4).int32 = len;
    enveloped.slice(4).raw = payload.raw;

    return enveloped;
  }


  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): Bytes {
    return data.slice(4, 4 + data.slice(0, 4).int32);
  }
}
