/* eslint-disable no-use-before-define */
/* eslint-disable no-bitwise */
/* eslint-disable max-classes-per-file */
// @flow

import HexDump from '../utils/hexdump';

export class TLMessage {
  hLen: number;

  buff: ArrayBuffer

  constructor(source: number | ArrayBuffer, ignoreHeaderPadding?: boolean = false) {
    const hLen = 20;

    if (typeof source === 'number') {
      this.buf = new ArrayBuffer(ignoreHeaderPadding ? source : hLen + source);
      this.hLen = hLen;
    } else {
      this.buf = source;
      this.hLen = hLen;
    }
  }

  dump(): string {
    return HexDump(this.buf);
  }

  withHeaders(): TLMessage {
    // eslint-disable-next-line no-unused-vars
    let offset = 8;

    offset = this.setMessageID(offset);
    offset = this.setLength(offset);

    return this.buf;
  }

  setMessageID(offset: number): number {
    const len = 8;
    const view = new TLMessageView(this.buf, offset, len, true);
    const timestamp = Date.now();

    view.setNumber(Math.floor(timestamp / 1000), 0, 4);
    view.setNumber(Math.floor(timestamp % 1000 << 21), 4, 0);

    return offset + len;
  }

  setLength(offset: number) {
    const len = 4;
    const view = new TLMessageView(this.buf, offset, len, true);

    view.setNumber(this.buf.byteLength - this.hLen);

    return offset + len;
  }
}

export class TLMessageView extends DataView {
  constructor(source: TLMessage | ArrayBuffer, offset: number, len: number, ignoreHeaderPadding: boolean = false) {
    if (source.withHeaders) {
      super(source.buf, ignoreHeaderPadding ? offset : source.hLen + offset, len);
    } else {
      super(source, offset, len);
    }
  }

  getString(offset: number = 0, len: number = this.byteLength): string {
    let str = '';

    for (let i = offset; i < len; i += 1) {
      str += String.fromCharCode(this.getUint8(i));
    }

    return str;
  }

  getNumber(offset: number = 0, len: number = this.byteLength): number {
    switch (len) {
      case 1:
        return this.getUint8(offset);

      case 2:
        return this.getUint16(offset, true);

      case 4:
        return this.getUint32(offset, true);

      case 8:
        return this.getBigUint64(offset, true);

      default:
        return 0;
    }
  }

  setString(str: string, offset: number = 0, len: number = this.byteLength): string {
    for (let i = offset; i < Math.min(str.length, len); i += 1) {
      this.setUint8(i, str.charCodeAt(i));
    }
  }

  setNumber(data: number, offset: number = 0, len: number = this.byteLength) {
    switch (len) {
      case 1:
        this.setUint8(offset, data);
        break;

      case 2:
        this.setUint16(offset, data, true);
        break;

      case 4:
        this.setUint32(offset, data, true);
        break;

      case 8:
        this.setBigUint64(offset, data, true);
        break;

      default:
        break;
    }
  }
}
