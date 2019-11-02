/* eslint-disable new-cap */
// @flow

import aesjs, { type ModeOfOperation } from 'aes-js';
import { Hex } from '../../serialization';

/**
 * Obfuscation for MTProto Transport Protocol
 * Ref: https://core.telegram.org/mtproto/mtproto-transports#transport-obfuscation
 */
export default class TransportObfuscation {
  /** Encription Cipher */
  enc: ModeOfOperation.ModeOfOperationCTR;

  /** Decription Cipher */
  dec: ModeOfOperation.ModeOfOperationCTR;

  /**
   * Creates initialization payload for establishing web-socket connection
   * @returns {ArrayBuffer} Initialization payload for obfuscation
   */
  init(header: Hex): ArrayBuffer {
    const dcID = new Hex('feff');
    const fullHeader = header.byteLength === 4 ? header : new Hex(header.repeat(4));

    const initPayload = Hex.concat(new Hex('ff'), Hex.random(55), fullHeader, dcID, Hex.random(2));
    const reversedPayload = initPayload.reverseBytes();

    const encKey = initPayload.sliceBytes(8, 40).toBuffer();
    const encIv = initPayload.sliceBytes(40, 56).toBuffer();
    const decKey = reversedPayload.sliceBytes(8, 40).toBuffer();
    const decIv = reversedPayload.sliceBytes(40, 56).toBuffer();

    const counterEnc = new aesjs.Counter(new Uint8Array(encIv));
    const counterDec = new aesjs.Counter(new Uint8Array(decIv));

    this.enc = new aesjs.ModeOfOperation.ctr(new Uint8Array(encKey), counterEnc);
    this.dec = new aesjs.ModeOfOperation.ctr(new Uint8Array(decKey), counterDec);

    const encryptedBuf = this.enc.encrypt(new Uint8Array(initPayload.toBuffer()));
    const encryptedInit = Hex.fromCharCode(...encryptedBuf);

    return Hex.concat(initPayload.sliceBytes(0, 56), encryptedInit.sliceBytes(56, 64)).toBuffer();
  }

  /**
   * Obfuscates data
   * @param {Hex} payload Input data to obfuscate
   * @returns {ArrayBuffer} Result data to send
   */
  encode(payload: Hex): ArrayBuffer {
    const encryptedBuf = this.enc.encrypt(new Uint8Array(payload.toBuffer()));
    const encryptedPayload = Hex.fromCharCode(...encryptedBuf);

    return encryptedPayload.toBuffer();
  }


  /**
   * Decodes obfuscated data
   * @param {ArrayBuffer} buf Input bytes
   * @returns {Hex} Decoded data
   */
  decode(buf: ArrayBuffer): Hex {
    const decryptedBuf = this.dec.encrypt(new Uint8Array(buf));
    return Hex.fromCharCode(...decryptedBuf);
  }
}
