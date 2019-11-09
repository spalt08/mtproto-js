/* eslint-disable class-methods-use-this */

import { PlainMessage, EncryptedMessage } from '../../message';
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
  wrap(payload: PlainMessage | EncryptedMessage): Bytes {
    const len = payload.buf.length;
    const plen = Math.floor(Math.random() * 15);
    const tlen = len + plen;

    const enveloped = new Bytes(4 + tlen);

    enveloped.slice(0, 4).int32 = tlen;
    enveloped.slice(4, 4 + len).raw = payload.buf.raw;
    enveloped.slice(4 + len).randomize();

    return enveloped;
  }

  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): PlainMessage | EncryptedMessage {
    let tlen = data.slice(0, 4).int32;

    if (tlen < 8) throw new Error(`Unexpected frame: ${data.hex}`);

    if (data.slice(4, 12).uint.toString() === '0') {
      return new PlainMessage(data.slice(4));
    }

    // todo: quick ack
    tlen = tlen % 16 === 8 ? tlen : tlen - 16 + (tlen % 16);
    tlen = tlen % 16 === 0 ? tlen + 8 : tlen;

    return new EncryptedMessage(data.slice(4, 4 + tlen));
  }
}
