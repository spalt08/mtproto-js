// @flow
// @flow

import { SchemaProvider, MTProto } from '../schemas';
import { GenericBuffer } from '../serialization';
import TLConstructor from './constructor';

/** TypeLanguage ties up all TL objects together and connects Schema to it */
export default class TypeLanguage {
  /** Schema Provider for declaring and mapping constructors */
  schema: SchemaProvider

  /**
   * TypeLanuage needs Schema to initialize
   * @param  {...Schema} schemas TL Json Schemas
   * @constructs
   */
  constructor(...schemas: Schema[]) {
    if (schemas.length > 0) {
      this.schema = new SchemaProvider(...schemas);
    } else {
      this.schema = new SchemaProvider(MTProto);
    }
  }

  /**
   * Method returns TLConstructor by query
   * @param {string | number} query TL Query or constructor number
   * @returns {TLConstructor} Type Language Constructor
   */
  construct(query: string | number): TLConstructor {
    return new TLConstructor(query, this.schema);
  }

  /**
   * Method returns TLConstructor with message by query and data
   * @param {string} query TL Query Expression
   * @returns {TLConstructor} Type Language Constructor with mapped buffer
   */
  query(query: string, data: object): TLConstructor {
    const c = new TLConstructor(query, this.schema, false, data);
    const buf = new GenericBuffer(c.byteSize);

    c.mapBuffer(buf);

    return c;
  }

  /**
   * Method wraps Byte Message to TLConstructor
   * @param {GenericBuffer} buf Byte Message
   * @returns {TLConstructor} Type Language Constructor
   * @param {boolean} isBare True if it is a bare constructor
   * @param {string} predicate Predicate string, if bare constructor
   */
  parse(buf: GenericBuffer, isBare?: boolean = false, predicate?: string = ''): TLConstructor {
    return TLConstructor.FromBuffer(buf, 0, this.schema, isBare, predicate);
  }
}
