import { Schema, SchemaEntity } from './types';
import MTProtoSchema from './mtproto.json';
import parse from './parse';

/**
 * SchemaProvider is an adaptor to schema json for quering constructors and types
 */
export default class SchemaProvider {
  schema: Map<string | number, SchemaEntity>;

  /**
   * SchemaProvider can be made from list of Schemas (ex. MTProtoSchema, LayerSchema, EndToEndSchema)
   */
  constructor(...schemas: Schema[]) {
    this.schema = new Map();
    this.put(MTProtoSchema.constructors);
    this.put(MTProtoSchema.methods);

    for (let i = 0; i < schemas.length; i += 1) {
      const { constructors, methods } = schemas[i];

      if (constructors) this.put(constructors);
      if (methods) this.put(methods);
    }
  }

  /**
   * Fills map with schema entities
   */
  put(source: SchemaEntity[]) {
    for (let i = 0; i < source.length; i += 1) {
      const row = source[i];
      const id = +row.id >>> 0;

      row.int32 = id;

      if (id) this.schema.set(id, row);
      if (row.method) this.schema.set(row.method, source[i]);
      if (row.predicate) this.schema.set(row.predicate, source[i]);
    }
  }

  /**
   * Method finds schema entity by predicate or ID.
   * If no results, it will parse schema from query string.
   */
  find(query: string | number): SchemaEntity | undefined {
    if (typeof query === 'number') query >>>= 0;

    return this.schema.get(query) || (typeof query === 'string' ? parse(query) : undefined);
  }

  /**
   * Method adds parsed query to flattened schema.
   * @param {string} query Constructor query
   */
  define(query: string) {
    const parsed = parse(query);

    if (parsed && parsed.type) this.put([parsed]);
  }
}
