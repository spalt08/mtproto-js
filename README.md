# Pure JavaScript MTProto Implementation

## Features
### Type Language Implementation
```js
import { TypeLanguage, Schema } from 'mtproto-js';

// Using predifined schemas
const tl = new TypeLanguage(Schema.MTProto, Schema.Layer105, Schema.EndToEnd);

// Using own schemas
const mySchema = Schema.Generate('<TL Syntax>');
const tl = new TypeLanguage(mySchema);

// Define schema entites on the fly
tl.define('req_pq_multi nonce:int128 = ResPQ');

// Generating Type Language Query
const q = tl.query('req_pq').randomize('nonce');
const q = tl.query('#be7e8ef1', { nonce: nonce });
const q = tl.query('req_pq_multi nonce:int128 = ResPQ');
const q = tl.query('req_pq_multi#be7e8ef1 nonce:int128 = ResPQ');
```

### RSA Keys Management
```js
transport.addRSAKey(`-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
-----END RSA PUBLIC KEY-----`);```
