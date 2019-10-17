# MTProto JS
JavaScript MTProto 2.0 Implementation.

Reference: https://core.telegram.org/mtproto

Current supported API layer is 105.

## General Use
```js
import { TypeLanguage, Http, Schema } from 'mtproto-js';

const tl = new TypeLanguage(Schema.MTProto, Schema.Layer105);
const server = new Http('venus.web.telegram.org', tl, {
  APIID: '******',
  APIHash: '********************',
  APILayer: 105,
});

server.connect().then(() => {
  const query = tl.create('auth.sendCode', {
    phone_number: 'string', 
    api_id: 999999, 
    api_hash: 'string', 
    settings: {},
  });

  const { result, headers } = await server.call(query);
  const json = result.json();
});
```

## Features
### Type Language
[Type language](https://core.telegram.org/schema) is an special notation for handling mtproto messages.

TypeLanguage class helps create and handle type language messages. Firstly, you need to create an class instance with json TL schemas args.
```js
const tlHandler = new TypeLanguage(MTProto, Schema.Layer105);
```
There is two schemas in example above: [base protocol schema](https://core.telegram.org/schema/mtproto) and [telegram api schema](https://core.telegram.org/schema)/

To create a type language constructor use `create` method:
```js
tlHandler.create('constructor name, id or TL formula', { ...params });
// examples
tlHandler.create('req_pq_multi', { nonce: 'some random int' });
tlHandler.create('req_pq_multi nonce:int128 = ResPQ', { nonce: 'some random int' });
tlHandler.create('#be7e8ef1', { nonce: 'some random int' })
tlHandler.create(3195965169, { nonce: 'some random int' })
```
If there is any constructor that is undefined at schema you can use `define` method or call `create` with formula. For exapmle, there is no `req_pq_multi` consturctor at [official MTProto scheme](https://core.telegram.org/schema/mtproto), but you can still use it.
```js
tlHandler.define('req_pq_multi nonce:int128 = ResPQ');
tlHandler.define('rsa_public_key n:string e:string = RSAPublicKey');
```
To unserialize byte-decoded message use `parse` method:
```js
tlHandler.parse(buffer: ArrayBuffer, isBare?: boolean, predicate?: string);
// example
tlHandler.parse(rsaPublicKeyBuffer, true, 'rsa_public_key n:string e:string = RSAPublicKey');
```

### Schema
Schema package has predefined schemas and several usefull methods
```js
import MTProto from 'mtproto-js';

MTProto.Schema.MTProto // json, predefined mtproto schema: https://core.telegram.org/schema/mtproto
MTProto.Schema.Layer105 // json, predefined layer schema: https://core.telegram.org/schema

MTProto.Schema.generateSchema('any tl program'); // generates json schema and returs it
MTProto.Schema.parse('tl expression or formula'); // returns single schema for constructor
```

### Transport
! WebSockets are under development, HTTP only
This package implements http, https and websocket and websocket over https [transports](https://core.telegram.org/mtproto#mtproto-transport) for MTProto.
```js
const server = new Http('server_address_for_auth', tl: TypeLangue, options: Object);

// example
import { Http, WebSocket } from 'mtproto-js';
const server = new Http('venus.web.telegram.org', tl, { ssl: true });
const server = new WebSocket('venus.web.telegram.org', tl, { ssl: true });
```

Transport classes has methods for calling encrypted and plain messages:
```js
server.call(query).then((response) => {
  console.log(response.headers);
  console.log(response.result.json());
}).catch((error) => {
  console.log(error);
});

server.callPlain(query); // also returns Promise
```

### Storage
You can provide any custom storage to transport that implements DataStorage interface;
```js
export interface DataStorage {
  /**
   * Method saves value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @param {any} value Value itself of any type
   */
  save(namespace: string, key: string, value: any): void;

  /**
   * Method gets value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @returns {any} Value itself of any type
   */
  load(namespace: string, key: string): any;
}
```

To connect custom storage to transport use transport options:
```js
server = new Http('address', tl, { storage: YourCustomStorage });
```

Storage is used to keep authorization and session data. Example values:
* {namespace.key: valueType}
* auth.AuthKeyTemp: stirng
* auth.AuthKeyTempExpire: number
* auth.AuthKeyPerm: stirng
* session.SessionID: string
* session.Expire: number
* session.ServerSalt: string
* session.NextServerSalt: string