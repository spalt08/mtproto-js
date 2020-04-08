/* eslint-disable new-cap */
import { CTR } from '@cryptography/aes';
import { Bytes } from '../../serialization';

/**
 * Obfuscation for MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#transport-obfuscation
 */
export default class Obfuscation {
  /** Encription Cipher */
  enc: any;

  /** Decription Cipher */
  dec: any;

  /**
   * Creates initialization payload for establishing web-socket connection
   */
  init(header: string): Bytes {
    const dcID = 'feff';
    const initPayload = new Bytes(64);

    initPayload.randomize();
    initPayload.buffer[0] = 0xFF;
    initPayload.slice(60, 62).hex = dcID;

    if (header.length > 0) initPayload.slice(56, 60).hex = header;

    const reversedPayload = initPayload.reverse();

    const encKey = initPayload.slice(8, 40);
    const encIv = initPayload.slice(40, 56);
    const decKey = reversedPayload.slice(8, 40);
    const decIv = reversedPayload.slice(40, 56);

    // to do: typing for aesjs
    this.enc = new CTR(encKey.buffer, encIv.buffer);
    this.dec = new CTR(decKey.buffer, decIv.buffer);

    const encrypted = new Bytes(this.enc.encrypt(initPayload.buffer));

    initPayload.slice(56).raw = encrypted.slice(56).raw;

    return initPayload;
  }

  /**
   * Obfuscates data
   */
  encode(payload: Bytes): Bytes {
    return new Bytes(this.enc.encrypt(payload.buffer));
  }


  /**
   * Decodes obfuscated data
   */
  decode(data: Bytes): Bytes {
    return new Bytes(this.dec.encrypt(data.buffer));
  }
}
