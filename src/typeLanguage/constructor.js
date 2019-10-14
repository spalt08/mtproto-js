/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
// @flow

import type { SchemaProvider, SchemaEntity } from '../schemas';
import { GenericView, GenericBuffer } from '../serialization';
import TLType from './type';
import TLNumber from './number';
import TLBytes from './bytes';
import TLVector from './vector';
import TLBoolean from './boolean';
import TLFlags from './flags';

/** GenericView is a wrapper for native DataView */
export default class TLConstructor extends TLType {
  /* Schema Entity for mapping props */
  declaration: SchemaEntity;

  /** Schema provider */
  schema: SchemaProvider;

  /* Params TL objects */
  params: { [string]: any }; // TLNumber | TLBytes | TLVector | TLBoolean | TLConstructor };

  /* Flag is bare type */
  isBare: boolean = false;

  /* Byte ofsset of constructor params */
  byteParamsOffset: number = 0;

  /* Flags predicate for optional fields */
  flags: ?TLFlags = undefined;

  /**
   * TLConstructor can be made from TL expression
   * @param {string | number} query TL expression or constructor number
   * @param {SchemaProvider} schema Schema provider
   * @param {boolean} isBare True if it is a bare constructor
   * @constructs
   */
  constructor(query?: string | number, schema?: SchemaProvider, isBare: boolean = false, data?: Object = {}) {
    super();

    this.schema = schema;

    if (typeof query === 'string' && query[0] === '%') {
      query = query.slice(1);
      isBare = true;
    }

    this.declaration = {};
    this.params = {};
    this.isBare = isBare;
    this.byteParamsOffset = isBare ? 0 : 4;

    if (query && schema) {
      this.declaration = schema.find(query);
      this.byteSize = isBare ? 0 : 4; // constructor initialization
      this.params = {};
    }

    if (this.declaration.id) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        const vectorExpr = /vector<(.+?)>|vector (.+?)/i;
        const flagExpr = /^flags.(\d+)\?(\w+)$/i;

        let paramType = param.type;
        let isOptional = false;
        let flagIndex = 0;
        let tlEntity;

        if (flagExpr.test(paramType)) {
          [, flagIndex, paramType] = paramType.match(flagExpr);
          isOptional = true;
        }

        if (param.name === 'flags' && paramType === '#') {
          this.flags = new TLFlags();
          this.byteSize += this.flags.byteSize;
        }

        if (TLNumber.ValidTypes.indexOf(paramType) !== -1) {
          tlEntity = new TLNumber(paramType, data[param.name]);
        }

        if (TLBytes.ValidTypes.indexOf(paramType) !== -1) {
          tlEntity = new TLBytes(data[param.name]);
        }

        if (paramType.toLowerCase() === 'bool' || paramType.toLowerCase() === 'true') {
          tlEntity = new TLBoolean(data[param.name], isOptional);
        }

        if (paramType === '!X') {
          tlEntity = data[param.name];
        }

        if (vectorExpr.test(paramType)) {
          const match = paramType.match(vectorExpr);
          const predicate = match[1] || match[2];

          tlEntity = new TLVector(predicate, schema, data[param.name]);
        }

        if (tlEntity) {
          tlEntity.isOptional = isOptional;
          tlEntity.flagIndex = flagIndex;

          this.byteSize += tlEntity.byteSize;
          this.params[param.name] = tlEntity;
        }
      }
    }
  }

  /**
   * TLConstructor can be made from buffer
   * @param {string | number} buf Source byte buffer
   * @param {SchemaProvider} schema Schema provider
   * @param {boolean} isBare True if it is a bare constructor
   * @param {string} predicate Predicate string, if bare constructor
   * @constructs @static
   */
  static FromBuffer(buf: GenericBuffer, bufOffset?: number = 0, schema: SchemaProvider, isBare?: boolean = false, predicate?: string): TLConstructor {
    let cnstr;

    if (isBare) {
      cnstr = new TLConstructor(predicate, schema, isBare);
    } else {
      const dView = new GenericView(buf, bufOffset);
      const cID = dView.getNumber(0, 4);
      const decl = schema.find(cID);

      if (!decl.id) throw new Error(`Type Language: Unknown constructor #${dView.getHex(0, 4, true)}`);

      cnstr = new TLConstructor(cID, schema);
    }

    cnstr.mapBuffer(buf, bufOffset);

    return cnstr;
  }

  /**
   * Method maps views for constructor and all params
   * @param {GenericBuffer} buf Message Buffer
   * @param {number} bufOffset Buffer Byte Offset
   * @returns {number} Byte offset
   */
  mapBuffer(buf: GenericBuffer, bufOffset?: number = 0): number {
    this.view = new GenericView(buf, bufOffset, this.byteSize);
    this.byteSize = this.byteParamsOffset;

    if (!this.isBare) {
      const viewConstructorID = this.view.getNumber(0, 4);
      if (viewConstructorID === 0 && this.view) {
        this.view.setNumber(this.declaration.id, 0, 4);
      }
    }

    let offset = bufOffset + this.byteParamsOffset;

    if (this.flags && this.flags instanceof TLFlags) {
      this.byteSize += this.flags.byteSize;
      offset = this.flags.mapBuffer(buf, offset);
    }

    for (let i = 0; i < this.declaration.params.length; i += 1) {
      const param = this.declaration.params[i];
      const paramHandler = this.params[param.name];

      if (paramHandler) {
        if (paramHandler.isOptional && this.flags && paramHandler.getValue()) {
          this.flags.set(paramHandler.flagIndex);
        }

        if (!paramHandler.isOptional || (this.flags && this.flags.has(paramHandler.flagIndex))) {
          if (paramHandler instanceof TLBoolean && paramHandler.isOptional) {
            paramHandler.setValue(true);
          } else {
            offset = paramHandler.mapBuffer(buf, offset);
          }
        }
      }

      if (param.type === 'Object') {
        const tlEntity = TLConstructor.FromBuffer(buf, offset, this.schema);

        this.params[param.name] = tlEntity;

        offset += tlEntity.byteSize;
      }

      if (this.params[param.name]) this.byteSize += this.params[param.name].byteSize;
    }

    return offset;
  }

  /**
   * Method creates new Generic Buffer and maps it to constructor
   * @returns {GenericBuffer} Serialized bytes
   */
  serialize(): GenericBuffer {
    const buf = new GenericBuffer(this.byteSize);

    this.mapBuffer(buf);

    return buf;
  }

  /**
   * Method gets object from params
   * @returns {object} Stored Value
   */
  getValue(): Object {
    const output = {};

    for (let i = 0; i < this.declaration.params.length; i += 1) {
      const param = this.declaration.params[i];
      output[param.name] = this.params[param.name].getValue();
    }

    return output;
  }

  /**
   * Shortcut for getValue
   * @returns {any} Json Object
   */
  json(): any {
    if (this.declaration.predicate === 'boolTrue') return true;
    if (this.declaration.predicate === 'boolFalse') return false;

    return this.getValue();
  }
}
