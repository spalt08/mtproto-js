/* eslint-disable import/no-cycle */
// @flow

import GenericView from './genericView';
import Hex from './hex';
import hdump from '../utils/hexdump';

/** GenericBuffer is a byte list, wrapper for native ArrayBuffer */
export default class GenericBuffer {
  /* Number of reserved prepending bytes */
  bytePaddingBefore: number = 0;

  /* Number of reserved appending bytes */
  bytePaddingAfter: number = 0;

  /* Number of payload bytes */
  payloadLength: number = 0;

  /* Pointer to native ArrayBuffer */
  buf: ArrayBuffer;

  /* View to whole native ArrayBuffer */
  view: GenericView;

  /**
   * @constructs
   * GenericBuffer can be made from scratch (zeroed buf by length) or hex-string or pre-existed ArrayBuffer
   */
  constructor(source: number | string | ArrayBuffer, bytePaddingBefore: number = 0, bytePaddingAfter: number = 0) {
    this.bytePaddingBefore = bytePaddingBefore;
    this.bytePaddingAfter = bytePaddingAfter;

    if (typeof source === 'object' && source.constructor.name === 'ArrayBuffer') {
      this.payloadLength = source.byteLength - this.bytePaddingBefore - this.bytePaddingAfter;

      this.buf = source;
      this.view = new GenericView(this.buf);
    } else if (typeof source === 'number') {
      const totalLength = this.bytePaddingBefore + source + this.bytePaddingAfter;
      this.payloadLength = source;

      this.buf = new ArrayBuffer(totalLength);
      this.view = new GenericView(this.buf);
    } else {
      const hexstr = new Hex(source);
      const totalLength = this.bytePaddingBefore + hexstr.byteLength + this.bytePaddingAfter;
      this.payloadLength = hexstr.byteLength;

      this.buf = new ArrayBuffer(totalLength);
      this.view = new GenericView(this.buf);

      for (let i = 0; i < source.byteLength; i += 1) {
        this.view.setUint8(this.bytePaddingBefore + i, hexstr.byteAt(i));
      }
    }
  }

  /**
   * Method converts arrayBuffer to hex-string.
   * @returns {string} Hex string
   */
  toHex(): Hex {
    return this.view.getHex();
  }

  /**
   * Method returns ArrayBuffer.
   * @returns {ArrayBuffer} Buffer
   */
  getBuffer(): ArrayBuffer {
    return this.buf;
  }

  /**
   * Method converts arrayBuffer to human-readable text.
   * @returns {string} Human-readable multiline hex dump
   */
  dump(): string {
    return hdump(this.buf);
  }
}
