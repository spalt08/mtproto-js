/* eslint-disable import/no-cycle */
// @flow

import type { TLAny } from '../interfaces';
import type { SchemaEntity } from '../schemas';

import { SchemaProvider } from '../schemas';
import { GenericView, GenericBuffer } from '../serialization';
import TLAbstract from './abstract';
import TLBoolean from './boolean';
import TLFlags from './flags';
import resolve from './resolve';

/** GenericView is a wrapper for native DataView */
export default class TLConstructor extends TLAbstract implements TLAny {
  /** Schortcut for this.declaration.predicate || this.declaration.method */
  _: string = '';

  /* Schema Entity for mapping props */
  declaration: ?SchemaEntity = null;

  /** Schema provider */
  schema: SchemaProvider;

  /** Flag handler */
  flags: ?TLFlags = null;

  /* Params is a map of type language handlers  */
  params: { [string]: TLAny };

  /* Flag is bare type */
  isBare: boolean = false;

  /* Byte ofsset of constructor params */
  byteParamsOffset: number = 4;

  /**
   * Creates type language constructor
   * @param {string | number} query TL expression or constructor number
   * @param {SchemaProvider} schema Schema provider
   * @param {boolean} isBare True if it is a bare constructor
   * @param {Object} data Data to be setted
   */
  constructor(query: string | number, schema: SchemaProvider, isBare?: boolean = false, data?: Object = {}) {
    super();

    this.schema = schema;

    this.declaration = null;
    this.params = {};
    this.isBare = isBare;
    this.byteParamsOffset = isBare ? 0 : 4;

    if (query && schema) {
      const declaration = schema.find(query);
      if (declaration && declaration.id) this.fetch(declaration);
    }

    if (data) this.value = data;
  }

  /**
   * Fetches type language schema
   * @param {SchemaEntity} declaration Type language constructor schema
   */
  fetch(declaration: SchemaEntity) {
    this.declaration = declaration;
    this._ = declaration.predicate || declaration.method || '';
    this.params = {};
    this.byteSize = this.byteParamsOffset;

    if (this.declaration.params) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];

        if (param.name === 'flags' && param.type === '#') {
          this.flags = new TLFlags();
          this.byteSize += this.flags.byteSize;
        } else {
          const paramHandler = resolve(param.type, this.schema);

          this.byteSize += paramHandler.byteSize;
          this.params[param.name] = paramHandler;
        }
      }
    }
  }

  /**
   * Sets value
   * @param {Object} data Data to be setted
   */
  set value(data: Object = {}) {
    if (data._) {
      const declaration = this.schema.find(data._);
      if (declaration && declaration.id) this.fetch(declaration);
    }

    this.byteSize = this.byteParamsOffset;

    if (this.flags) this.byteSize += this.flags.byteSize;

    if (this.declaration && this.declaration.params) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        let paramHandler = this.params[param.name];

        if (paramHandler) {
          if (paramHandler instanceof TLConstructor && data[param.name] instanceof TLConstructor) {
            this.params[param.name] = data[param.name];
            paramHandler = data[param.name];
          } else {
            paramHandler.value = data[param.name];
          }

          if (paramHandler.isOptional && this.flags && paramHandler.hasValue()) {
            this.flags.set(paramHandler.flagIndex);
          }

          this.byteSize += paramHandler.byteSize;
        }
      }
    }
  }

  /**
   * Method gets object from params
   * @returns {object} Stored Value
   */
  get value(): Object {
    const output = {};

    if (this.declaration && this.declaration.params) {
      output._ = this.declaration.predicate || this.declaration.method;

      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        if (this.params[param.name]) output[param.name] = this.params[param.name].value;
      }
    }

    return output;
  }

  /**
   * Method maps part of buffer
   * @param {GenericBuffer} buf Buffer for mapping
   * @param {number} offset Byte offset for mapping buffer
   * @returns {number} Byte offset after mapping
   */
  map(buf: GenericBuffer, offset?: number = 0): number {
    const cView = new GenericView(buf, offset, 4);
    const cID = cView.getNumber();

    if (!this.isBare) {
      if (cID === 0 && this.declaration) {
        cView.setNumber(this.declaration.id);
      } else {
        const declaration = this.schema.find(cID);
        if (declaration && declaration.id) this.fetch(declaration);
      }
    } else {
      this.byteParamsOffset = 0;
    }

    this.byteSize = this.byteParamsOffset;

    let nextOffset = offset + this.byteParamsOffset;

    if (this.flags) {
      this.byteSize += this.flags.byteSize;
      nextOffset = this.flags.map(buf, nextOffset);
    }

    if (this.declaration && this.declaration.params) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        const paramHandler = this.params[param.name];

        if (paramHandler) {
          if (paramHandler.isOptional && paramHandler instanceof TLBoolean) {
            if (this.flags && this.flags.has(paramHandler.flagIndex)) {
              paramHandler.value = true;
            }
          } else if (!paramHandler.isOptional || paramHandler.hasValue() || (this.flags && this.flags.has(paramHandler.flagIndex))) {
            nextOffset = paramHandler.map(buf, nextOffset);
          }

          if (paramHandler.hasValue() && this.flags && !this.flags.has(paramHandler.flagIndex)) {
            this.flags.set(paramHandler.flagIndex);
          }

          this.byteSize += paramHandler.byteSize;
        }
        // else console.log('missing param handler', param.name, this);
      }
    }

    return nextOffset;
  }

  /**
   * Method checks nested params for a values
   * @returns {boolean} If constructor has any param with value
   */
  hasValue(): boolean {
    if (this.declaration && this.declaration.params) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        if (this.params[this.declaration.params[i].name]) {
          if (this.params[this.declaration.params[i].name].hasValue()) return true;
        }
      }
    }

    return false;
  }

  /**
   * Method creates new Generic Buffer and maps it to constructor
   * @returns {GenericBuffer} Serialized bytes
   */
  serialize(): GenericBuffer {
    const buf = new GenericBuffer(this.byteSize);

    this.map(buf, 0);

    return buf;
  }

  /**
   * Shortcut for getting value
   * @returns {any} Json Object
   */
  json(): any {
    if (this.declaration && this.declaration.predicate === 'boolTrue') return true;
    if (this.declaration && this.declaration.predicate === 'boolFalse') return false;

    return this.value;
  }
}
