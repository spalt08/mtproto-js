import { Bytes } from '../../serialization';
import TLConstructor from '../../tl/constructor';
import SchemaProvider from '../../schema/provider';
import sha1 from '../sha1';

export type RSAKey = {
  fingerprint: string,
  n: string,
  e: string,
};

/**
 * Converts base64-encoded public key to {fingerprint, modulus, exponent} object
 */
export function parseKey(key: string): RSAKey {
  const matches = key.match(/-----BEGIN ([A-Z ]+?)-----([A-Za-z0-9\s+/]+)-----([A-Z ]+?)-----/m);

  if (!matches) throw new Error(`RSA Key: Unable to parse key \n ${key}`);

  const keyType = matches[1];
  const raw = atob(matches[2].trim());

  const buf = new Bytes(raw.length);
  buf.raw = raw;

  let n: string; let e: string;

  switch (keyType) {
    case 'RSA PUBLIC KEY':
      n = buf.slice(9, 265).hex;
      e = buf.slice(buf.length - 3).hex;
      break;

    case 'PUBLIC KEY':
      n = buf.slice(33, 289).hex;
      e = buf.slice(buf.length - 3).hex;
      break;

    default:
      throw new Error(`RSA Key: Unknown key format ${keyType}`);
  }

  const tlKey = new TLConstructor('rsa_public_key n:bytes e:bytes = RSAPublicKey', new SchemaProvider(), true, { n, e });
  const keyHash = sha1(tlKey.serialize().raw);

  return {
    fingerprint: keyHash.slice(keyHash.length - 8).hex,
    n,
    e,
  };
}

export const PredefinedKeys: RSAKey[] = [
  /**
   * -----BEGIN RSA PUBLIC KEY-----
   * MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
   * lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
   * an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
   * Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
   * 8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
   * Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
   * -----END RSA PUBLIC KEY-----
   */
  {
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
  },

  /** ********************************************** */

  /** -----BEGIN PUBLIC KEY-----
   * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAruw2yP/BCcsJliRoW5eB
   * VBVle9dtjJw+OYED160Wybum9SXtBBLXriwt4rROd9csv0t0OHCaTmRqBcQ0J8fx
   * hN6/cpR1GWgOZRUAiQxoMnlt0R93LCX/j1dnVa/gVbCjdSxpbrfY2g2L4frzjJvd
   * l84Kd9ORYjDEAyFnEA7dD556OptgLQQ2e2iVNq8NZLYTzLp5YpOdO1doK+ttrltg
   * gTCy5SrKeLoCPPbOgGsdxJxyz5KKcZnSLj16yE5HvJQn0CNpRdENvRUXe6tBP78O
   * 39oJ8BTHp9oIjd6XWXAsp2CvK45Ol8wFXGF710w9lwCGNbmNxNYhtIkdqfsEcwR5
   * JwIDAQAB
   * -----END PUBLIC KEY----- */
  {
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
  },

  /** ********************************************** */

  /** -----BEGIN PUBLIC KEY-----
   * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvfLHfYH2r9R70w8prHbl
   * Wt/nDkh+XkgpflqQVcnAfSuTtO05lNPspQmL8Y2XjVT4t8cT6xAkdgfmmvnvRPOO
   * KPi0OfJXoRVylFzAQG/j83u5K3kRLbae7fLccVhKZhY46lvsueI1hQdLgNV9n1cQ
   * 3TDS2pQOCtovG4eDl9wacrXOJTG2990VjgnIKNA0UMoP+KF03qzryqIt3oTvZq03
   * DyWdGK+AZjgBLaDKSnC6qD2cFY81UryRWOab8zKkWAnhw2kFpcqhI0jdV5QaSCEx
   * vnsjVaX0Y1N0870931/5Jb9ICe4nweZ9kSDF/gip3kWLG0o8XQpChDfyvsqB9OLV
   * /wIDAQAB
   * -----END PUBLIC KEY----- */
  {
    fingerprint: '429552b5a85fae15',
    n: 'bdf2c77d81f6afd47bd30f29ac76e55adfe70e487e5e48297e5a9055c9c07d2b93b4'
    + 'ed3994d3eca5098bf18d978d54f8b7c713eb10247607e69af9ef44f38e28f8b439f25'
    + '7a11572945cc0406fe3f37bb92b79112db69eedf2dc71584a661638ea5becb9e23585'
    + '074b80d57d9f5710dd30d2da940e0ada2f1b878397dc1a72b5ce2531b6f7dd158e09c'
    + '828d03450ca0ff8a174deacebcaa22dde84ef66ad370f259d18af806638012da0ca4a'
    + '70baa83d9c158f3552bc9158e69bf332a45809e1c36905a5caa12348dd57941a48213'
    + '1be7b2355a5f4635374f3bd3ddf5ff925bf4809ee27c1e67d9120c5fe08a9de458b1b'
    + '4a3c5d0a428437f2beca81f4e2d5ff',
    e: '010001',
  },

  /** ********************************************** */

  /** -----BEGIN PUBLIC KEY-----
   * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs/ditzm+mPND6xkhzwFI
   * z6J/968CtkcSE/7Z2qAJiXbmZ3UDJPGrzqTDHkO30R8VeRM/Kz2f4nR05GIFiITl
   * 4bEjvpy7xqRDspJcCFIOcyXm8abVDhF+th6knSU0yLtNKuQVP6voMrnt9MV1X92L
   * GZQLgdHZbPQz0Z5qIpaKhdyA8DEvWWvSUwwc+yi1/gGaybwlzZwqXYoPOhwMebzK
   * Uk0xW14htcJrRrq+PXXQbRzTMynseCoPIoke0dtCodbA3qQxQovE16q9zz4Otv2k
   * 4j63cz53J+mhkVWAeWxVGI0lltJmWtEYK6er8VqqWot3nqmWMXogrgRLggv/Nbbo
   * oQIDAQAB
   * -----END PUBLIC KEY----- */
  {
    fingerprint: '4ff9d73ce198aeae',
    n: 'b3f762b739be98f343eb1921cf0148cfa27ff7af02b6471213fed9daa0098976e6677'
    + '50324f1abcea4c31e43b7d11f1579133f2b3d9fe27474e462058884e5e1b123be9cbbc'
    + '6a443b2925c08520e7325e6f1a6d50e117eb61ea49d2534c8bb4d2ae4153fabe832b9e'
    + 'df4c5755fdd8b19940b81d1d96cf433d19e6a22968a85dc80f0312f596bd2530c1cfb2'
    + '8b5fe019ac9bc25cd9c2a5d8a0f3a1c0c79bcca524d315b5e21b5c26b46babe3d75d06'
    + 'd1cd33329ec782a0f22891ed1db42a1d6c0dea431428bc4d7aabdcf3e0eb6fda4e23eb'
    + '7733e7727e9a1915580796c55188d2596d2665ad1182ba7abf15aaa5a8b779ea996317'
    + 'a20ae044b820bff35b6e8a1',
    e: '010001',
  },

  /** ********************************************** */

  /** -----BEGIN PUBLIC KEY-----
   * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvmpxVY7ld/8DAjz6F6q0
   * 5shjg8/4p6047bn6/m8yPy1RBsvIyvuDuGnP/RzPEhzXQ9UJ5Ynmh2XJZgHoE9xb
   * nfxL5BXHplJhMtADXKM9bWB11PU1Eioc3+AXBB8QiNFBn2XI5UkO5hPhbb9mJpjA
   * 9Uhw8EdfqJP8QetVsI/xrCEbwEXe0xvifRLJbY08/Gp66KpQvy7g8w7VB8wlgePe
   * xW3pT13Ap6vuC+mQuJPyiHvSxjEKHgqePji9NP3tJUFQjcECqcm0yV7/2d0t/pbC
   * m+ZH1sadZspQCEPPrtbkQBlvHb4OLiIWPGHKSMeRFvp3IWcmdJqXahxLCUS1Eh6M
   * AQIDAQAB
   * -----END PUBLIC KEY----- */
  {
    fingerprint: '987d0535221b185a',
    n: 'be6a71558ee577ff03023cfa17aab4e6c86383cff8a7ad38edb9fafe6f323f2d5106cb'
    + 'c8cafb83b869cffd1ccf121cd743d509e589e68765c96601e813dc5b9dfc4be415c7a65'
    + '26132d0035ca33d6d6075d4f535122a1cdfe017041f1088d1419f65c8e5490ee613e16d'
    + 'bf662698c0f54870f0475fa893fc41eb55b08ff1ac211bc045ded31be27d12c96d8d3cf'
    + 'c6a7ae8aa50bf2ee0f30ed507cc2581e3dec56de94f5dc0a7abee0be990b893f2887bd2'
    + 'c6310a1e0a9e3e38bd34fded2541508dc102a9c9b4c95effd9dd2dfe96c29be647d6c69'
    + 'd66ca500843cfaed6e440196f1dbe0e2e22163c61ca48c79116fa77216726749a976a1c'
    + '4b0944b5121e8c01',
    e: '010001',
  },
];
