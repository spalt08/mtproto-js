// @flow

import { SchemaProvider, TelegramBase } from '../schemas';
import TLConstructor from './entites/constructor';
import { TLMessage } from './serialization';

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

  response(buf: ArrayBuffer): TLConstructor {
    const message = new TLMessage(buf);
    console.log('Response: \n', message.dump());
    return new TLConstructor(message, this.schema);
  }

  define(query: string) {
    this.schema.define(query);
  }
}

/*
MTProto.Scheme(schm);

var req = MTProto.Request('req_pq')

req.randomize('nonce')
req.set('param', '1324')

var socket = MTProto.Socket();
var http = MTProto.http();

var msg = req.compose()
socket.send(msg)
http.send(msg)

---------

var tl = new MTProto.TL(schm)

var msg = tl.query('req_pg').randomize('nonce').compose()

socket.send(msg)
http.send(msg)
*/
