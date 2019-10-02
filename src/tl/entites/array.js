// @flow

import { TLMessageView, TLMessage } from '../serialization';
import type { SchemaEntity, SchemaProvider } from '../../schemas';
import TLVariable from './variable';

export default class TLArray {
  schema: SchemaProvider;

  declaration: SchemaEntity;

  itemsDeclaration: SchemaEntity;

  template: string | null;

  items: Array<TLVariable>;

  length: number;

  initView: TLMessageView;

  lengthView: TLMessageView;

  allocBytes: number = 5;

  constructor(id: number, template: string, schema: SchemaProvider) {
    this.declaration = schema.find(id);
    this.template = template || this.declaration.listEntityType;
    this.itemsDeclaration = schema.find(this.template);
    this.schema = schema;
    this.items = [];
  }

  map(message: TLMessage, offset: number): number {
    this.initView = new TLMessageView(message, offset, 4);
    this.lengthView = new TLMessageView(message, offset + 4, 1);

    this.length = this.lengthView.getNumber();

    let ofst = offset + 4;

    for (let i = 0; i < this.length; i += 1) {
      const variable = new TLVariable(this.itemsDeclaration.id, this.schema);

      ofst = variable.map(message, ofst);

      this.items.push(variable);
    }

    return ofst;
  }

  get(): number {
    return this.view.getNumber();
  }

  set(value: string | number) {
    this.view.setNumber(value);
  }
}
