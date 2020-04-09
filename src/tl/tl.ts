import { SchemaProvider, Schema } from '../schema';
import TLConstructor from './constructor';
import resolve from './resolve';
import TLAbstract from './abstract';
import { Reader32 } from '../serialization';

/** TypeLanguage ties up all TL objects together and connects Schema to it */
export default class TypeLanguage {
  /** Schema Provider for declaring and mapping constructors */
  schema: SchemaProvider;

  /**
   * TypeLanuage needs Schema to initialize
   */
  constructor(...schemas: Schema[]) {
    this.schema = new SchemaProvider(...schemas);
  }

  /**
   * Method returns TLConstructor by query
   */
  create(query: string | number, data?: Record<string, any>): TLConstructor {
    return new TLConstructor(query, this.schema, false, data);
  }

  /**
   * Method wraps Byte Message to TLConstructor
   */
  parse(reader: Reader32, isBare: boolean = false, predicate: string = ''): TLAbstract {
    let c: TLAbstract;

    if (predicate && isBare) {
      c = resolve(predicate, this.schema);
    } else {
      const cID = reader.int32();
      const schemaPredicate = this.schema.find(cID);

      if (schemaPredicate) {
        c = resolve(schemaPredicate.predicate || schemaPredicate.method || '', this.schema);
      } else {
        throw new Error('Unable to parse');
      }

      reader.rollback();
    }

    if (isBare) c.isBare = isBare;

    c.read(reader);

    return c;
  }

  /**
   * Method extends schema
   */
  define(formula: string) {
    this.schema.define(formula);
  }
}
