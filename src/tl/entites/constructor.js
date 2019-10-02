// @flow

import type { SchemaEntity, SchemaProvider } from '../../schemas';
import { TLMessage, TLMessageView } from '../serialization';
import TLVariable from './variable';
import TLArray from './array';

export default class TLConstructor {
  declaration: SchemaEntity;

  properties: {};

  propNames: Array;

  allocBytes: number;

  message: TLMessage;

  view: TLMessageView;

  constructor(source: string | number | TLMessage, schema: SchemaProvider) {
    if (typeof source === 'number') {
      this.fromID(source, schema);
    } else if (typeof source === 'string') {
      this.fromString(source, schema);
    } else if (typeof source === 'object' && source.buf) {
      this.fromBuffer(source, schema);
    }

    if (!this.declaration.id) throw new Error(`TL: Unknown query ${source}`);
    if (this.declaration.type !== 'constructor') throw new Error(`TL: Query ${source} is not a constructor`);
  }

  fromID(id: number, schema: SchemaProvider) {
    this.declaration = schema.find(id);

    this.setProps(schema);
    this.createBuffer();
  }

  fromString(query: string, schema: SchemaProvider) {
    this.declaration = schema.find(query);

    this.setProps(schema);
    this.createBuffer();
  }

  fromBuffer(message: TLMessage, schema: SchemaProvider) {
    this.message = message;
    this.view = new TLMessageView(message, 0, 4);
    this.declaration = schema.find(this.view.getNumber());

    this.setProps(schema);
    this.mapBuffer();
  }

  setProps(schema: SchemaProvider) {
    this.properties = {};
    this.propNames = [];

    let allocBytes = 4;

    for (let i = 0; i < this.declaration.properties.length; i += 1) {
      const prop = this.declaration.properties[i];
      const propSchema = schema.find(prop.predicate);

      let entity;

      if (prop.type === 'string' || prop.type === 'bytes') {
        throw new Error('string and bytes types are currently unsupported; use more obvious types in tl declaration');
      } else {
        switch (propSchema.type) {
          case 'system_type':
            entity = new TLVariable(propSchema.id, schema);
            allocBytes += entity.declaration.allocate;
            break;

          case 'list':
            entity = new TLArray(propSchema.id, prop.template, schema);
            allocBytes += entity.allocBytes;
            break;

          default:
            break;
        }

        this.properties[prop.name] = entity;
        this.propNames.push(prop.name);
      }
    }

    this.allocBytes = allocBytes;
  }

  createBuffer() {
    this.message = new TLMessage(this.allocBytes);

    this.view = new TLMessageView(this.message, 0, 4);
    this.view.setNumber(this.declaration.id);

    this.mapBuffer();
  }

  mapBuffer() {
    let offset = 4;

    for (let i = 0; i < this.propNames.length; i += 1) {
      const propName = this.propNames[i];
      offset = this.properties[propName].map(this.message, offset);
    }
  }

  toString(): string {
    return this.message.dump();
  }

  set(propName: string, value: string | number): TLConstructor {
    this.properties[propName].set(value);

    return this;
  }

  randomize(propName: string): TLConstructor {
    const prop = this.properties[propName];
    const bytes = [];

    for (let i = 0; i < prop.view.byteLength; i += 1) {
      bytes.push(Math.ceil(Math.random() * 255));
    }

    prop.set(String.fromCharCode(...bytes));

    return this;
  }

  getString(propName: string): string {
    return this.properties[propName].getString();
  }

  serialize(): TLMessage {
    return this.message.withHeaders();
  }
}
