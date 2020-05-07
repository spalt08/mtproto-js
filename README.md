# mtproto-js
*This project is still under development right now, so feel free to ask anything or contribute.*

JavaScript MTProto 2.0 Implementation. Current supported API layer is 113.

Reference: https://core.telegram.org/mtproto
 

## General Use
```js
import { TypeLanguage, Http, Schema } from 'mtproto-js';

const tl = new TypeLanguage(Schema.MTProto, Schema.Layer113);
const server = new Http('venus.web.telegram.org', tl, {
  APIID: '******',
  APIHash: '********************',
  APILayer: 113,
});

server.connect().then(() => {
  const { result, headers } = await server.call('auth.sendCode', {
    phone_number: 'string', 
    api_id: 999999, 
    api_hash: 'string', 
    settings: {},
  });
  const json = result.json();
});
```

## Features
### Type Language
[Type language](https://core.telegram.org/schema) is an special notation for handling mtproto messages.

TypeLanguage class helps create and handle type language messages. Firstly, you need to create an class instance with json TL schemas args.
```js
const tlHandler = new TypeLanguage(Schema.MTProto, Schema.Layer113);
```
*There is two schemas in example above: [base protocol schema](https://core.telegram.org/schema/mtproto) and [telegram api schema](https://core.telegram.org/schema).*

To create a type language constructor use `create` method:
```js
// tlHandler.create('constructor name, id or TL formula', { ...params });
tlHandler.create('req_pq', { nonce: 'some random int' });
tlHandler.create('req_pq_multi#be7e8ef1 nonce:int128 = ResPQ', { nonce: 'some random int' });
```
If there is any constructor that is undefined at schema you can use `define` method or call `create` with formula. For example, there is no `req_pq_multi` or `rsa_public_key` consturctor at [official MTProto scheme](https://core.telegram.org/schema/mtproto), but you can still use it.
```js
tlHandler.define('rsa_public_key n:string e:string = RSAPublicKey');
```
To unserialize byte-decoded message use `parse` method:
```js
// tlHandler.parse(buffer: ArrayBuffer, isBare?: boolean, predicate?: string);
tlHandler.parse(rsaPublicKeyBuffer, true, 'rsa_public_key n:string e:string = RSAPublicKey');
```

### Schema
Schema package has predefined schemas and several usefull methods
```js
import MTProto from 'mtproto-js';

MTProto.Schema.MTProto // json, predefined mtproto schema: https://core.telegram.org/schema/mtproto
MTProto.Schema.Layer112 // json, predefined layer schema: https://core.telegram.org/schema

MTProto.Schema.generateSchema('any tl program'); // generates json schema and returs it
MTProto.Schema.parse('tl expression or formula'); // returns single schema for constructor
```

### Transport
This package implements http, https, websocket and websocket over https [transports](https://core.telegram.org/mtproto#mtproto-transport) for MTProto.
```js
import { Http, Socket } from 'mtproto-js';

// const server = new Http(addr: string, tl: TypeLanguage, options: Object);
const server = new Http('venus.web.telegram.org', tl, { ssl: true });
const server = new Socket('venus.web.telegram.org', tl, { ssl: true });
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

You can use `connect` method or manage connection manually
```js
await server.connect();
// or 
await server.auth.prepare(); // tries to load auth keys from storage or creates them
await server.session.prepare(); // tries to load session from storage or invoke session with layer
await server.updates.prepare(); // runs update loop
```

To listen update messages use `on` subscribe method:
```js
server.updates.on('updateUserStatus', function(data) {
  console.log(data.json());
});
```

### Storage
You can provide any custom storage to transport that implements DataStorage interface:
```js
export interface DataStorage {
  /**
   * Method saves value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @param {any} value Value itself of any type
   */
  save(namespace: string, key: string, value: any): Promise<void>;

  /**
   * Method gets value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @returns {Promise<any>} Value itself of any type
   */
  load(namespace: string, key: string): Promise<any>;
}
```

To connect custom storage to transport use transport options:
```js
server = new Http('address', tl, { storage: YourCustomStorage });
```

Storage is used to keep authorization and session data. 

Example values: `{namespace.key: valueType}`
* `auth.tempKey: stirng`
* `auth.tempKeyExpire: number`
* `auth.permKey: stirng`
* `session.sid: string`
* `session.expires: number`
* `session.serverSalt: string`