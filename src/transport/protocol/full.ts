import crc32 from '../../utils/crc32';
import { Bytes } from '../../serialization';
import { PlainMessage, EncryptedMessage } from '../../message';

/**
 * Full MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#full
 */
export default class Full {
  /**
   * Protocol header
   */
  header = '';

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
   */
  wrap(payload: Bytes): Bytes {
    const len = payload.length;
    const tlen = len + 12;

    const enveloped = new Bytes(tlen);

    enveloped.slice(0, 4).int32 = tlen;
    enveloped.slice(4, 8).int32 = this.seqOut;
    enveloped.slice(8, 8 + len).raw = payload.raw;
    enveloped.slice(8 + len).hex = crc32(enveloped.slice(0, 8 + len).raw).toString(16);

    this.seqOut += 1;

    return enveloped;
  }

  /**
   * Unwraps incoming bytes to type language message
   */
  unWrap(data: Bytes): EncryptedMessage | PlainMessage {
    const tlen = data.slice(0, 4).int32;
    const seq = data.slice(4, 8).int32;
    const crc = +`0x${data.slice(tlen - 4, tlen).hex}`;
    let len = tlen - 12;

    // eslint-disable-next-line no-console
    if (seq !== this.seqIn) console.warn('Invalid seq_no for incoming message');
    if (crc !== crc32(data.slice(0, tlen - 4).raw)) throw new Error('Invalid CRC for incoming message');

    if (len < 8) throw new Error(`Unexpected frame: ${data.hex}`);

    if (data.slice(8, 16).uint === '0000000000000000') {
      return new PlainMessage(data.slice(8, 8 + len));
    }

    len = len % 16 === 8 ? len : len - 16 + (len % 16);
    len = len % 16 === 0 ? len + 8 : len;

    return new EncryptedMessage(data.slice(8, 8 + len));
  }
}
