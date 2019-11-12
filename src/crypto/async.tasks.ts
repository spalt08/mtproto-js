import BigInt from 'big-integer';
import { Bytes, hex } from '../serialization';
import { BrentPrime } from './pq';
import { RSAKey } from './rsa/keys';
import RSAEncrypt from './rsa/encrypt';
import sha1 from './sha1';
import { decrypt, encrypt } from './aes/ige';
import {
  Abridged,
  IntermediatePadded,
  Full,
  Intermediate,
  Obfuscation,
} from '../transport/protocol';
import { Message, PlainMessage, EncryptedMessage } from '../message';
import { encryptMessage, decryptMessage } from './aes/message';
import sha256 from './sha256';

/** Factorization PQ */
export function factorize(pq: string): string[] {
  return BrentPrime(BigInt(pq, 16)).map((p) => p.toString(16));
}

/** Encrypting pq_inner_data */
export function ecnryptPQ(data: Bytes, pk: RSAKey): string {
  const dataToEncrypt = new Bytes(255);

  dataToEncrypt.slice(0, 20).raw = sha1(data.raw).raw;
  dataToEncrypt.slice(20, 20 + data.length).raw = data.raw;
  dataToEncrypt.slice(20 + data.length).randomize();

  return RSAEncrypt(dataToEncrypt.hex, pk.n, pk.e);
}

/** Decrypting server_DH_inner_data */
export function decryptDH(data: Bytes, nn: Bytes, sn: Bytes): Bytes {
  const tmpAesKey = new Bytes(32);
  const tmpAesIv = new Bytes(32);

  tmpAesKey.slice(0, 20).raw = sha1(nn.raw + sn.raw).raw;
  tmpAesKey.slice(20, 32).raw = sha1(sn.raw + nn.raw).slice(0, 12).raw;

  tmpAesIv.slice(0, 8).raw = sha1(sn.raw + nn.raw).slice(12, 20).raw;
  tmpAesIv.slice(8, 28).raw = sha1(nn.raw + nn.raw).raw;
  tmpAesIv.slice(28, 32).raw = nn.slice(0, 4).raw;

  return decrypt(data, tmpAesKey, tmpAesIv);
}

/** Encrypting client_DH_inner_data */
export function encryptDH(data: Bytes, nn: Bytes, sn: Bytes): Bytes {
  const tmpAesKey = new Bytes(32);
  const tmpAesIv = new Bytes(32);

  tmpAesKey.slice(0, 20).raw = sha1(nn.raw + sn.raw).raw;
  tmpAesKey.slice(20, 32).raw = sha1(sn.raw + nn.raw).slice(0, 12).raw;

  tmpAesIv.slice(0, 8).raw = sha1(sn.raw + nn.raw).slice(12, 20).raw;
  tmpAesIv.slice(8, 28).raw = sha1(nn.raw + nn.raw).raw;
  tmpAesIv.slice(28, 32).raw = nn.slice(0, 4).raw;

  let len = 20 + data.length;
  len += 16 - (len % 16);

  const plain = new Bytes(len);

  plain.slice(0, 20).raw = sha1(data.raw).raw;
  plain.slice(20, 20 + data.length).raw = data.raw;
  plain.slice(20 + data.length).randomize();

  return encrypt(plain, tmpAesKey, tmpAesIv);
}

/**
 * Global objects for handing transport envelope and obfuscation
 */
const obfuscation: Record<number, Obfuscation> = {};
const protocol: Record<number, Intermediate | IntermediatePadded | Full | Abridged> = {};

/**
 * Create obfuscation init payload
 */
export function transportInit(dc: number, thread: number, transport: string, protocolName: string): Bytes {
  const key = thread * 10 + dc;

  if (transport === 'websocket') {
    switch (protocolName) {
      case 'abridged': protocol[key] = new Abridged(); break;
      case 'intermediate_padded': protocol[key] = new IntermediatePadded(); break;
      case 'full': protocol[key] = new Full(); break;
      default: protocol[key] = new Intermediate();
    }

    obfuscation[key] = new Obfuscation();

    return obfuscation[key].init(protocol[key].header);
  }

  return new Bytes(0);
}

/**
 * Encrypt, envelope and obfuscate outgoint message
 */
export function transportEncrypt(dc: number, thread: number, msg: Message | PlainMessage, transport: string, authKey: string) {
  const key = thread * 10 + dc;

  if (msg instanceof PlainMessage) {
    if (transport === 'websocket') {
      return obfuscation[key].encode(protocol[key].wrap(msg.buf));
    }

    return msg.buf;
  }

  const encrypted = encryptMessage(authKey, msg);

  if (transport === 'websocket') {
    return obfuscation[key].encode(protocol[key].wrap(encrypted.buf));
  }

  return encrypted.buf;
}

/**
 * Deobfuscate, deenvelope and decrypt incoming message
 */
export function transportDecrypt(dc: number, thread: number, data: Bytes, transport: string, authKey: string): PlainMessage | Message | Bytes {
  const key = thread * 10 + dc;
  let msg: Bytes;

  if (transport === 'websocket') {
    [, msg] = protocol[key].unWrap(obfuscation[key].decode(data));
  } else {
    msg = data;
  }

  if (msg.length <= 8) return msg;

  const akey = msg.slice(0, 8).uint.toString();

  // Plain message
  if (akey === '0') {
    return new PlainMessage(msg);
  }

  try {
    const decrypted = decryptMessage(authKey, new EncryptedMessage(msg));
    return decrypted;
  } catch (e) {
    return msg;
  }
}

// export function getPassword(cfg: any, password: string): any {
//   if (password === '' || !cfg.current_algo || cfg.current_algo._ === 'passwordKdfAlgoUnknown') {
//     return { _: 'passwordKdfAlgoUnknown' };
//   }

//   const clientSalt = hex(cfg.current_algo.salt1 as string);
//   const serverSalt = hex(cfg.current_algo.salt2 as string);
//   const g = cfg.current_algo.g as number;
//   const p = BigInt(cfg.current_algo.p, 16);

//   const b = cfg.srp_B ? BigInt(cfg.srp_B, 16) : BigInt(0);
//   const id = cfg.srp_id || BigInt(0);

//   const buf = sha256(hex(clientSalt.hex + str))

//   $buf = $this->hashSha256($password, $client_salt);
//       $buf = $this->hashSha256($buf, $server_salt);
//         $hash = \hash_pbkdf2('sha512', $buf, $client_salt, 100000, 0, true);
//         return $this->hashSha256($hash, $server_salt);
//   const x = BigInt($this->hashPassword($password, $client_salt, $server_salt), 256);
  
// }