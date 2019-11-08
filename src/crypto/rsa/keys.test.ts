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
    fingerprint: '216be86c022bb4c3',
    n: 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f'
     + '8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e5802'
     + '30e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b'
     + '8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d86'
     + '6b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b'
     + '6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083'
     + 'a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde7'
     + '4a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
    e: '010001',
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
    fingerprint: 'a5b7f709355fc30b',
    n: 'aeec36c8ffc109cb099624685b97815415657bd76d8c9c3e398103d7ad16c9bba6f'
     + '525ed0412d7ae2c2de2b44e77d72cbf4b7438709a4e646a05c43427c7f184debf72'
     + '947519680e651500890c6832796dd11f772c25ff8f576755afe055b0a3752c696eb'
     + '7d8da0d8be1faf38c9bdd97ce0a77d3916230c4032167100edd0f9e7a3a9b602d04'
     + '367b689536af0d64b613ccba7962939d3b57682beb6dae5b608130b2e52aca78ba0'
     + '23cf6ce806b1dc49c72cf928a7199d22e3d7ac84e47bc9427d0236945d10dbd1517'
     + '7bab413fbf0edfda09f014c7a7da088dde9759702ca760af2b8e4e97cc055c617bd'
     + '74c3d97008635b98dc4d621b4891da9fb0473047927',
    e: '010001',
  });
});
