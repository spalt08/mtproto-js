import { parseKey } from './keys';

test('rsa | keys', () => {
  const key = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
-----END RSA PUBLIC KEY-----`;

  expect(parseKey(key)).toEqual({
    fingerprint: 'c3b42b026ce86b21',
    n: new Uint32Array([
      0xc150023e, 0x2f70db79, 0x85ded064, 0x759cfecf, 0x0af328e6, 0x9a41daf4, 0xd6f01b53, 0x8135a6f9, 0x1f8f8b2a, 0x0ec9ba97, 0x20ce352e, 0xfcf6c568,
      0x0ffc424b, 0xd6348649, 0x02de0b4b, 0xd6d49f4e, 0x580230e3, 0xae97d95c, 0x8b19442b, 0x3c0a10d8, 0xf5633fec, 0xedd6926a, 0x7f6dab0d, 0xdb7d457f,
      0x9ea81b84, 0x65fcd6ff, 0xfeed1140, 0x11df91c0, 0x59caedaf, 0x97625f6c, 0x96ecc747, 0x25556934, 0xef781d86, 0x6b34f011, 0xfce4d835, 0xa090196e,
      0x9a5f0e44, 0x49af7eb6, 0x97ddb907, 0x6494ca5f, 0x81104a30, 0x5b6dd276, 0x65722c46, 0xb60e5df6, 0x80fb16b2, 0x10607ef2, 0x17652e60, 0x236c255f,
      0x6a28315f, 0x4083a967, 0x91d7214b, 0xf64c1df4, 0xfd0db194, 0x4fb26a2a, 0x57031b32, 0xeee64ad1, 0x5a8ba688, 0x85cde74a, 0x5bfc920f, 0x6abf59ba,
      0x5c755063, 0x73e7130f, 0x9042da92, 0x2179251f,
    ]),
    e: 65537,
  });

  const keyRSA = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAruw2yP/BCcsJliRoW5eB
VBVle9dtjJw+OYED160Wybum9SXtBBLXriwt4rROd9csv0t0OHCaTmRqBcQ0J8fx
hN6/cpR1GWgOZRUAiQxoMnlt0R93LCX/j1dnVa/gVbCjdSxpbrfY2g2L4frzjJvd
l84Kd9ORYjDEAyFnEA7dD556OptgLQQ2e2iVNq8NZLYTzLp5YpOdO1doK+ttrltg
gTCy5SrKeLoCPPbOgGsdxJxyz5KKcZnSLj16yE5HvJQn0CNpRdENvRUXe6tBP78O
39oJ8BTHp9oIjd6XWXAsp2CvK45Ol8wFXGF710w9lwCGNbmNxNYhtIkdqfsEcwR5
JwIDAQAB
-----END PUBLIC KEY-----`;

  expect(parseKey(keyRSA)).toEqual({
    fingerprint: '0bc35f3509f7b7a5',
    n: new Uint32Array([
      0xaeec36c8, 0xffc109cb, 0x09962468, 0x5b978154, 0x15657bd7, 0x6d8c9c3e, 0x398103d7, 0xad16c9bb, 0xa6f525ed, 0x0412d7ae, 0x2c2de2b4, 0x4e77d72c,
      0xbf4b7438, 0x709a4e64, 0x6a05c434, 0x27c7f184, 0xdebf7294, 0x7519680e, 0x65150089, 0x0c683279, 0x6dd11f77, 0x2c25ff8f, 0x576755af, 0xe055b0a3,
      0x752c696e, 0xb7d8da0d, 0x8be1faf3, 0x8c9bdd97, 0xce0a77d3, 0x916230c4, 0x03216710, 0x0edd0f9e, 0x7a3a9b60, 0x2d04367b, 0x689536af, 0x0d64b613,
      0xccba7962, 0x939d3b57, 0x682beb6d, 0xae5b6081, 0x30b2e52a, 0xca78ba02, 0x3cf6ce80, 0x6b1dc49c, 0x72cf928a, 0x7199d22e, 0x3d7ac84e, 0x47bc9427,
      0xd0236945, 0xd10dbd15, 0x177bab41, 0x3fbf0edf, 0xda09f014, 0xc7a7da08, 0x8dde9759, 0x702ca760, 0xaf2b8e4e, 0x97cc055c, 0x617bd74c, 0x3d970086,
      0x35b98dc4, 0xd621b489, 0x1da9fb04, 0x73047927,
    ]),
    e: 0x010001,
  });
});
