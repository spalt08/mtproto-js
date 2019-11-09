/* eslint-disable class-methods-use-this */
import { PlainMessage, EncryptedMessage } from '../../message';
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
  wrap(payload: PlainMessage | EncryptedMessage): Bytes {
    const len = payload.buf.length;
    const enveloped = new Bytes(4 + len);

    enveloped.slice(0, 4).int32 = len;
    enveloped.slice(4).raw = payload.buf.raw;

    return enveloped;
  }


  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): PlainMessage | EncryptedMessage {
    let len = data.slice(0, 4).int32;

    if (len < 8) throw new Error(`Unexpected frame: ${data.hex}`);

    if (data.slice(4, 12).uint.toString() === '0') {
      return new PlainMessage(data.slice(4));
    }

    len = len % 16 === 8 ? len : len - 16 + (len % 16);
    len = len % 16 === 0 ? len + 8 : len;

    return new EncryptedMessage(data.slice(4, 4 + len));
  }
}
