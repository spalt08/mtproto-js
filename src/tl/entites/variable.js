// @flow

import { TLMessageView, TLMessage } from '../serialization';
import type { SchemaEntity } from '../../schemas';
import SchemaProvider from '../../schemas';

export default class TLVariable {
  declaration: SchemaEntity;

  view: TLMessageView;

  constructor(id: number, schema: SchemaProvider) {
    this.declaration = schema.find(id);
  }

  map(message: TLMessage, offset: number): number {
    this.view = new TLMessageView(message, offset, this.declaration.allocate);

    return offset + this.declaration.allocate;
  }

  getString(): number {
    return this.view.getString();
  }

  getHexString(isBigEndian: boolean = false): string {
    return this.view.getHexString(undefined, undefined, isBigEndian);
  }

  getNumber(): number {
    return this.view.getNumber();
  }

  getArrayBuffer(): ArrayBuffer {
    return this.view.getArrayBuffer();
  }

  set(value: string | number) {
    if (typeof value === 'string') {
      this.view.setString(value);
    } else {
      this.view.setNumber(value);
    }
  }

  setHexString(value: string, isBigEndian: boolean = false) {
    this.view.setHexString(value, undefined, undefined, isBigEndian);
  }
}
