import { Schema, SchemaEntity } from './types';
import MTProtoSchema from './mtproto.json';
import parse from './parse';

type SchemaMap = Map<string | number, SchemaEntity>;

/**
 * SchemaProvider is an adaptor to schema json for quering constructors and types
 */
export default class SchemaProvider {
  mtproto: SchemaMap;
  layer: SchemaMap;

  /**
   * SchemaProvider can be made from list of Schemas (ex. MTProtoSchema, LayerSchema, EndToEndSchema)
   */
  constructor(...schemas: Schema[]) {
    this.layer = new Map();
    this.mtproto = new Map();

    // default for mtproto schema
    this.put(this.mtproto, MTProtoSchema.constructors);
    this.put(this.mtproto, MTProtoSchema.methods);

    for (let i = 0; i < schemas.length; i += 1) {
      const { constructors, methods } = schemas[i];

      if (constructors) this.put(this.layer, constructors);
      if (methods) this.put(this.layer, methods);
    }
  }

  /**
   * Fills map with schema entities
   */
  put(map: SchemaMap, source: SchemaEntity[]) {
    for (let i = 0; i < source.length; i += 1) {
      const row = source[i];
      const id = +row.id >>> 0;

      row.int32 = id;

      if (id) map.set(id, row);
      if (row.method) map.set(row.method, source[i]);
      if (row.predicate) map.set(row.predicate, source[i]);
    }
  }

  /**
   * Method finds schema entity by predicate or ID.
   * If no results, it will parse schema from query string.
   */
  find(query: string | number): SchemaEntity | undefined {
    if (typeof query === 'number') query >>>= 0;
    if (typeof query === 'string' && query[0] === '%') query = query.slice(1).toLowerCase();

    return this.mtproto.get(query) || this.layer.get(query) || (typeof query === 'string' ? parse(query) : undefined);
  }

  /**
   * Method adds parsed query to flattened schema.
   * @param {string} query Constructor query
   */
  define(query: string) {
    const parsed = parse(query);

    if (parsed && parsed.type) this.put(this.layer, [parsed]);
  }
}
