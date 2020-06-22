# mtproto-js
Extremly fast and lightweight JavaScript MTProto 2.0 implementation. Current supported API layer is 113.
Works both for browser and Node.
Reference: https://core.telegram.org/mtproto
 
Created for Telegram JS Contest 2020:
https://contest.com/javascript-web-3/entry1422

## General Use
```ts
import { Client } from 'mtproto-js';

/** Client configuration */
type ClientConfig = {
  test: boolean,
  debug: boolean,
  ssl: boolean,
  dc: number,
  transport: 'websocket' | 'http',
  meta: Record<number, any>,

  APILayer: number,
  APIID?: string,
  APIHash?: string,

  deviceModel: string,
  systemVersion: string,
  appVersion: string,
  langCode: string,

  autoConnect: boolean,
};

const client = new Client(clientConfig);

client.on('metaChanged', (newMeta) => console.log(newMeta)); // save keys and authorization data
client.updates.on((update) => console.log(update));
client.updates.fetch();

client.call(
  'help.getNearestDc', // method name
  {}, // params
  { dc: 2, thread: 1, transport: 'websocket' }, // headers (optional)
  (err, result) => console.log(err, result),
);
```

## Features
* Unit tests
* TL schema code generation
* Typed
* Multithreading
* Supports both WebSockets and HTTP

## Contributions 
Thanks @misupov for schema code generation tool https://github.com/misupov/tg-schema-generator