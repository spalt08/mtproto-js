// @flow
// @flow

import { SchemaProvider, MTProto } from '../schemas';
import { GenericBuffer, Hex } from '../serialization';
import TLConstructor from './constructor';
import resolve from './resolve';

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
   * @param {object} data Data to set
   * @returns {TLConstructor} Type Language Constructor
   * @constructs
   */
  create(query: string | number, data?: object): TLConstructor {
    return new TLConstructor(query, this.schema, false, data);
  }

  /**
   * Method wraps Byte Message to TLConstructor
   * @param {GenericBuffer | Hex} buf Byte Message
   * @returns {TLConstructor} Type Language Constructor
   * @param {boolean} isBare True if it is a bare constructor
   * @param {string} predicate Predicate string, if bare constructor
   */
  parse(source: GenericBuffer | Hex, isBare?: boolean = false, predicate?: string = ''): TLConstructor {
    const c = resolve(predicate, this.schema);

    if (isBare) c.isBare = isBare;

    if (source instanceof GenericBuffer) {
      c.map(source, 0);
    } else if (source instanceof Hex) {
      c.map(source.toBuffer(), 0);
    }

    return c;
  }
}
