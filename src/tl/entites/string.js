// @flow

import { TLMessageView, TLMessage } from '../serialization';
import type { SchemaEntity } from '../../schemas';
import SchemaProvider from '../../schemas';

// temp
const name2allocate = {
  'req_dh_params.encrypted_data': 256,
  'client_dh_inner_data.g_b': 256,
  'set_client_dh_params.encrypted_data': 336,
};

export default class TLString {
  length: number = 0;

  allocBytes: number;

  dataView: TLMessageView;

  lengthView: TLMessageView;

  lenPaddingView: TLMessageView;

  constructor(constName: string, propName: string, schema: SchemaProvider) {
    this.length = name2allocate[`${constName}.${propName}`] || 0;
    this.allocBytes = this.length + (this.length % 4) + (this.length > 253 ? 4 : 1);
  }

  map(message: TLMessage, offset: number): number {
    let lenBytesNum = 1;
    let fb = 0;

    this.lengthView = new TLMessageView(message, offset, 1);

    if (this.length === 0) {
      fb = this.lengthView.getNumber();
    }

    if (fb > 253 || this.allocBytes > 253) {
      lenBytesNum = 4;

      this.lenPaddingView = this.lengthView;
      this.lengthView = new TLMessageView(message, offset + 1, 3);

      if (this.length === 0) this.length = this.lengthView.getNumber();
    } else if (fb > 0) {
      this.length = fb;
    }

    this.dataView = new TLMessageView(message, offset + lenBytesNum, this.length);

    return offset + lenBytesNum + this.length + (this.length % 4);
  }

  getString(): number {
    return this.dataView.getString();
  }

  getHexString(isBigEndian: boolean = false): string {
    return this.dataView.getHexString(undefined, undefined, isBigEndian);
  }

  setHexString(value: string, isBigEndian: boolean = true) {
    // eslint-disable-next-line no-param-reassign
    if (value.length % 2 === 1) value = `0${value}`;

    this.length = value.length / 2;

    this.lengthView.setNumber(this.length);

    if (this.length > 253) {
      this.lenPaddingView.setNumber(254);
    }

    this.dataView.setHexString(value, undefined, undefined, isBigEndian);
  }
}
