// @flow

import type { Schema, FlattenedSchema, SchemaEntity } from './types';
import parse from './parser';

/**
 * SchemaProvider is an adaptor to schema json for quering constructors and types
 */
export default class SchemaProvider {
  /* Flattened schema with list of constructors */
  schema: FlattenedSchema;

  /**
   * SchemaProvider can be made from list of Schemas (ex. MTProtoSchema, LayerSchema, EndToEndSchema)
   * @param {Schema[]} schemas One schema object for parameter
   * @constructs
   */
  constructor(...schemas: Schema[]) {
    this.schema = [];

    for (let i = 0; i < schemas.length; i += 1) {
      this.schema.push(...schemas[i].constructors);
      if (schemas[i].methods) this.schema.push(...schemas[i].methods);
    }
  }

  /**
   * Method finds schema entity by predicate or ID.
   * If no results, it will parse schema from query string.
   * @param {string | number} query Constructor predicate or ID
   * @returns {SchemaEntity} Schema Entity
   */
  find(query: string | number): SchemaEntity {
    const result = this.schema.find((s) => (
      parseInt(s.id, 10) === parseInt(query, 10)
   || parseInt(s.id, 10) === parseInt(query, 16)
   || (query.toLowerCase && s.predicate && s.predicate.toLowerCase() === query.toLowerCase())
   || (query.toLowerCase && s.method && s.method.toLowerCase() === query.toLowerCase())
    ));

    if (!result) {
      if (typeof query === 'number') throw new Error(`TL: Unknown constructor number ${query}`);
      const parsed = parse(query);

      if (parsed.type) this.define(query);

      return this.schema.find((s) => s.predicate === parsed.predicate);
    }

    return result;
  }

  /**
   * Method adds parsed query to flattened schema.
   * @param {string} query Constructor query
   */
  define(query: string) {
    this.schema.push(
      parse(query),
    );
  }
}
