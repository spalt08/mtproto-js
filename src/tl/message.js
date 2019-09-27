/* eslint-disable no-bitwise */
// @flow

export default class TLMessage {
  /*
   * @prop Message Buffer
   * buffer: ArrayBufferr
   */

  constructor(source: number | ArrayBuffer) {
    this.headersLength = 20;

    if (typeof source === 'object' && source.byteLength > 0) {
      this.buffer = source;
      this.length = source - this.headersLength;
    } else {
      this.buffer = new ArrayBuffer(source + this.headersLength);
      this.length = source;
    }
  }

  withHeaders(): ArrayBuffer {
    this.MessageIDHeader(8);
    this.MessageLengthHeader(16);

    return this.buffer;
  }

  MessageIDHeader(offset: number) {
    const timestamp = Date.now();

    this.fillNumber(offset, 4, Math.floor(timestamp / 1000));
    this.fillNumber(offset + 4, 4, Math.floor(timestamp % 1000 << 21));
  }

  MessageLengthHeader(offset: number) {
    this.fillNumber(offset, 4, this.length);
  }

  fill(offset: number, length: number, data: number | string): number {
    if (typeof data === 'number') {
      this.fillNumber(this.headersLength + offset, length, data);
    } else {
      this.fillString(this.headersLength + offset, length, data);
    }

    return offset + length;
  }

  fillNumber(offset: number, length: number, data: number) {
    const view = new DataView(this.buffer, offset, length);

    let i = 0;

    switch (length) {
      case 4:
        view.setUint32(0, data);
        break;

      default:
        while (data > 0 && i < length) {
          const byte = data & 0xFF;
          view.setUint8(i, byte);
          data = (data - byte) / 256; // eslint-disable-line no-param-reassign
          i += 1;
        }
        break;
    }
  }

  fillString(offset: number, length: number, data: string) {
    const view = new DataView(this.buffer, offset, length);

    for (let i = 0; i < data.length; i += 1) {
      view.setUint8(i, data.charCodeAt(i));
    }
  }
}
