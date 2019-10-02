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

  getNumber(): number {
    return this.view.getNumber();
  }

  set(value: string | number) {
    if (typeof value === 'string') {
      this.view.setString(value);
    } else {
      this.view.setNumber(value);
    }
  }
}
