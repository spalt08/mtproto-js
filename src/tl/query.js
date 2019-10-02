// @flow

import SchemaProvider from '../schemas';
import TLConstructor from './entites/constructor';

export default class TLQuery {
  schema: SchemaProvider;

  raw: string;

  c: TLConstructor

  constructor(query: string | number, schema: SchemaProvider) {
    this.schema = schema;
    this.raw = query;

    this.c = new TLConstructor(query, schema);
  }
}
