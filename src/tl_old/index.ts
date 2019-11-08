import { TLAny } from '../interfaces';
import { Schema, SchemaProvider } from '../schemas';
import { GenericBuffer, Hex, GenericView } from '../serialization';
import TLConstructor from './constructor';
import resolve from './resolve';

/** TypeLanguage ties up all TL objects together and connects Schema to it */
export default class TypeLanguage {
  /** Schema Provider for declaring and mapping constructors */
  schema: SchemaProvider;

  /**
   * TypeLanuage needs Schema to initialize
   * @param  {...Schema} schemas TL Json Schemas
   * @constructs
   */
  constructor(...schemas: Schema[]) {
    if (schemas.length > 0) {
      this.schema = new SchemaProvider(...schemas);
    } else {
      this.schema = new SchemaProvider();
    }
  }

  /**
   * Method returns TLConstructor by query
   * @param {string | number} query TL Query or constructor number
   * @param {object} data Data to set
   * @returns {TLConstructor} Type Language Constructor
   * @constructs
   */
  create(query: string | number, data?: Object): TLConstructor {
    return new TLConstructor(query, this.schema, false, data);
  }

  /**
   * Method wraps Byte Message to TLConstructor
   * @param {GenericBuffer | Hex} buf Byte Message
   * @returns {TLConstructor} Type Language Constructor
   * @param {boolean} isBare True if it is a bare constructor
   * @param {string} predicate Predicate string, if bare constructor
   */
  parse(source: GenericBuffer | Hex | ArrayBuffer, isBare: boolean = false, predicate: string = ''): TLAny {
    let c;
    let buf = new GenericBuffer(0);

    if (source instanceof GenericBuffer) {
      buf = source;
    } else if (source instanceof ArrayBuffer) {
      buf = new GenericBuffer(source);
    } else if (source instanceof Hex) {
      buf = new GenericBuffer(source.toBuffer());
    }

    if (predicate) {
      c = resolve(predicate, this.schema);
    } else {
      const view = new GenericView(buf);
      const cID = view.getNumber(0, 4);
      const schemaPredicate = this.schema.find(cID as number);

      if (schemaPredicate && schemaPredicate.type) {
        c = resolve(schemaPredicate.predicate || schemaPredicate.method || '', this.schema);
      }
    }

    c.map(buf, 0);

    if (isBare) c.isBare = isBare;

    return c;
  }
}
