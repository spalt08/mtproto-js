import { Schema, SchemaEntity } from './types';
import MTProtoSchema from './mtproto.json';
import parse from './parse';

/**
 * SchemaProvider is an adaptor to schema json for quering constructors and types
 */
export default class SchemaProvider {
  /* Flattened schema with list of constructors */
  schema: SchemaEntity[] = [];

  /**
   * SchemaProvider can be made from list of Schemas (ex. MTProtoSchema, LayerSchema, EndToEndSchema)
   * @param {Schema[]} schemas One schema object for parameter
   * @constructs
   */
  constructor(...schemas: Schema[]) {
    this.schema = [...MTProtoSchema.constructors, ...MTProtoSchema.methods];

    for (let i = 0; i < schemas.length; i += 1) {
      const constrs = schemas[i].constructors;
      const methods = schemas[i].constructors;

      if (constrs) this.schema.push(...constrs);
      if (methods) this.schema.push(...methods);
    }
  }

  /**
   * Method finds schema entity by predicate or ID.
   * If no results, it will parse schema from query string.
   * @param {string | number} query Constructor predicate or ID
   * @returns {SchemaEntity} Schema Entity
   */
  find(query: string | number): SchemaEntity {
    for (let i = 0; i < this.schema.length; i += 1) {
      const s = this.schema[i];

      if (typeof query === 'number' && parseInt(s.id, 10) === query) {
        return s;
      }

      if (typeof query === 'string' && (+s.id === +`0x${query.toString}`
      || (s.predicate && s.predicate.toLowerCase() === query.toLowerCase())
      || (s.method && s.method.toLowerCase() === query.toLowerCase()))) {
        return s;
      }
    }

    if (typeof query === 'number') throw new Error(`TL: Unknown constructor number ${query}`);

    if (typeof query === 'string') {
      const parsed = parse(query);

      if (parsed && parsed.type) {
        this.define(query);
        return parsed;
      }

      throw new Error(`Unable to parse TL: ${query}`);
    }

    throw new Error(`Unable to parse TL: ${query}`);
  }

  /**
   * Method adds parsed query to flattened schema.
   * @param {string} query Constructor query
   */
  define(query: string) {
    const parsed = parse(query);
    if (parsed && parsed.type) this.schema.push(parsed);
  }
}
