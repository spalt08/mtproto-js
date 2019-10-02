// @flow

import type { Schema, SchemaEntity } from './types';
import parse from './parser';

// SchemaProvider is an adaptor to schema json for quering constructors and types
export default class SchemaProvider {
  schema: Schema;

  constructor(...schemas) {
    this.schema = [];

    for (let i = 0; i < schemas.length; i += 1) {
      this.schema.push(...schemas[i]);
    }
  }

  find(query: string | number): SchemaEntity {
    if (typeof query === 'number') {
      return this.schema.find((s) => s.id === query);
    }

    if (typeof query === 'string') {
      const constr = parse(query);

      if (constr.result) this.define(query);

      return this.schema.find((s) => s.predicate === constr.predicate);
    }

    return this.schema.find((s) => s.predicate === query);
  }

  define(query: string) {
    this.schema.push(
      parse(query),
    );
  }
}
