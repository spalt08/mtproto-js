// @flow

import { SchemaProvider, TelegramBase } from '../schemas';
import TLConstructor from './entites/constructor';
import { TLMessage } from './serialization';
import { log } from '../utils/log';

export default class TL {
  schema: SchemaProvider

  constructor(...schemas: Schema) {
    if (schemas.length > 0) {
      this.schema = new SchemaProvider(...schemas);
    } else {
      this.schema = new SchemaProvider(TelegramBase);
    }
  }

  query(query: string | number): TLConstructor {
    return new TLConstructor(query, this.schema);
  }

  construct(query: string | number): TLConstructor {
    return new TLConstructor(query, this.schema, { skipHeaders: true });
  }

  fromHex(hexStr: string, skipHeaders?: boolean = false): TLConstructor {
    const message = TLMessage.FromHex(hexStr, skipHeaders);

    return new TLConstructor(message, this.schema, { skipHeaders });
  }

  response(buf: ArrayBuffer): TLConstructor {
    const message = new TLMessage(buf);

    log('got response from server: \n', message.dump());

    return new TLConstructor(message, this.schema);
  }

  define(query: string) {
    this.schema.define(query);
  }
}
