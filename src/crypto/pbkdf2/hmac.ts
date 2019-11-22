import sha512 from '../hash/sha512';
import { Bytes } from '../../serialization';

/**
 * Produces the Message Authentication Code (MAC).
 */
export default function hmac(message: string, _key: string, blen: number = 128, digest: Function = sha512): Bytes {
  let key = _key;

  // if key is longer than blocksize, hash it
  if (key.length > blen) key = digest(key);

  // mix key into inner and outer padding
  // ipadding = [0x36 * blocksize] ^ key
  // opadding = [0x5C * blocksize] ^ key
  let ipad = '';
  let opad = '';
  for (let i = 0; i < key.length; i += 1) {
    const kchar = key.charCodeAt(i);
    ipad += String.fromCharCode(0x36 ^ kchar);
    opad += String.fromCharCode(0x5C ^ kchar);
  }

  // if key is shorter than blocksize, add additional padding
  if (key.length < blen) {
    for (let i = 0; i < blen - key.length; i += 1) {
      ipad += String.fromCharCode(0x36);
      opad += String.fromCharCode(0x5C);
    }
  }

  // digest is done like so: hash(opadding | hash(ipadding | message))
  return digest(opad + digest(ipad + message).raw);
}
