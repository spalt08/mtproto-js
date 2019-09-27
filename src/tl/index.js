/* eslint-disable class-methods-use-this */
// @flow

import TLQuery from './query';
import TLResponse from './response';
import TLSchemaAdapter from './schema';

export class TL {
  /*
   * @prop Tl-schema
   * schema: TLSchemaAdapter
   *
   * https://core.telegram.org/schema
   */

  constructor(schema: string | object) {
    if (typeof schema === 'string') {
      fetch(schema).then((r) => r.json()).then((s) => { this.schema = new TLSchemaAdapter(s); });
    } else {
      this.schema = new TLSchemaAdapter(schema);
    }
  }

  query(q: string): TLQuery {
    return new TLQuery(q, this.schema);
  }

  response(buf: ArrayBuffer): TLResponse {
    return new TLResponse(buf, this.schema);
  }

  define(q: string) {
    this.schema.defineConstructor(q);
  }
}

export { TLQuery, TLResponse };
