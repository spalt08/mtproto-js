import BigInt from 'big-integer';
import sha1 from '@cryptography/sha1';
import sha256 from '@cryptography/sha256';
import sha512 from '@cryptography/sha512';
import pbkdf2 from '@cryptography/pbkdf2';
import { Bytes, hex } from '../serialization';
import { BrentPrime } from './pq';
import { RSAKey } from './rsa/keys';
import RSAEncrypt from './rsa/encrypt';
import { decrypt, encrypt } from './aes/ige';
import {
  Abridged,
  IntermediatePadded,
  Full,
  Intermediate,
  Obfuscation,
} from '../transport/protocol';
import {
  Message, PlainMessage, EncryptedMessage, MessageV1,
} from '../message';
import { encryptMessage, decryptMessage } from './aes/message';
import { encryptMessageV1 } from './aes/message.v1';

/** Factorization PQ */
export function factorize(pq: string): string[] {
  return BrentPrime(BigInt(pq, 16)).map((p) => p.toString(16));
}

/** Encrypting pq_inner_data */
export function ecnryptPQ(data: Bytes, pk: RSAKey): string {
  const dataToEncrypt = new Bytes(255);

  dataToEncrypt.slice(0, 20).raw = sha1(data.raw);
  dataToEncrypt.slice(20, 20 + data.length).raw = data.raw;
  dataToEncrypt.slice(20 + data.length).randomize();

  return RSAEncrypt(dataToEncrypt.hex, pk.n, pk.e);
}

/** Decrypting server_DH_inner_data */
export function decryptDH(data: Bytes, nn: Bytes, sn: Bytes): Bytes {
  const tmpAesKey = new Bytes(32);
  const tmpAesIv = new Bytes(32);

  tmpAesKey.slice(0, 20).raw = sha1(nn.raw + sn.raw);
  tmpAesKey.slice(20, 32).raw = sha1(sn.raw + nn.raw).slice(0, 12);

  tmpAesIv.slice(0, 8).raw = sha1(sn.raw + nn.raw).slice(12, 20);
  tmpAesIv.slice(8, 28).raw = sha1(nn.raw + nn.raw);
  tmpAesIv.slice(28, 32).raw = nn.slice(0, 4).raw;

  return decrypt(data, tmpAesKey, tmpAesIv);
}

export function genKey(cg: number, cga: string, cdh: string): [string, string] {
  const g = BigInt(cg);
  const ga = BigInt(cga, 16);
  const dhPrime = BigInt(cdh, 16);
  const b = BigInt(new Bytes(255).randomize().hex, 16);
  const gb = g.modPow(b, dhPrime).toString(16);
  const authKey = ga.modPow(b, dhPrime).toString(16);

  return [gb, authKey];
}

/** Encrypting client_DH_inner_data */
export function encryptDH(data: Bytes, nn: Bytes, sn: Bytes): Bytes {
  const tmpAesKey = new Bytes(32);
  const tmpAesIv = new Bytes(32);

  tmpAesKey.slice(0, 20).raw = sha1(nn.raw + sn.raw);
  tmpAesKey.slice(20, 32).raw = sha1(sn.raw + nn.raw).slice(0, 12);

  tmpAesIv.slice(0, 8).raw = sha1(sn.raw + nn.raw).slice(12, 20);
  tmpAesIv.slice(8, 28).raw = sha1(nn.raw + nn.raw);
  tmpAesIv.slice(28, 32).raw = nn.slice(0, 4).raw;

  let len = 20 + data.length;
  len += 16 - (len % 16);

  const plain = new Bytes(len);

  plain.slice(0, 20).raw = sha1(data.raw);
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
 * Encrypt, envelope and obfuscate outgoint message
 */
export function transportEncryptv1(msg: MessageV1, authKey: string) {
  const encrypted = encryptMessageV1(authKey, msg);
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

function phex(size: number, value: string): Bytes {
  let str = '';
  for (let i = 0; i < size - value.length / 2; i += 1) {
    str += '00';
  }

  return hex((str + value).slice(-size * 2));
}

export function getPasswordKdf(
  salt1: string, salt2: string, cg: number, cp: string, srpId: string, csrpB: string, password: string, rand?: string,
): any {
  const clientSalt = hex(salt1);
  const serverSalt = hex(salt2);
  const g = BigInt(cg);
  const p = BigInt(cp, 16);

  const gBuf = phex(256, g.toString(16));
  const pBuf = phex(256, cp);

  const srpB = BigInt(csrpB, 16);
  const srpBBuf = phex(256, csrpB);

  let pwdhash;
  pwdhash = sha256(clientSalt.raw + password + clientSalt.raw);
  pwdhash = sha256(serverSalt.raw + pwdhash + serverSalt.raw);
  pwdhash = pbkdf2(pwdhash, clientSalt.raw, 100000, 64, sha512);
  pwdhash = new Bytes(sha256(serverSalt.raw + pwdhash + serverSalt.raw));

  const x = BigInt(pwdhash.hex, 16);
  const gx = g.modPow(x, p);

  const k = BigInt(new Bytes(sha256(pBuf.raw + gBuf.raw)).hex, 16);
  const kgx = k.multiply(gx).mod(p);

  const aBuf = rand ? hex(rand) : new Bytes(256).randomize();
  const a = BigInt(aBuf.hex, 16);
  const Ac = g.modPow(a, p);
  const AcBuf = phex(256, Ac.toString(16));

  let bkgx = srpB.subtract(kgx);
  if (bkgx.lesser(BigInt.zero)) bkgx = bkgx.add(p);

  const u = BigInt(new Bytes(sha256(AcBuf.raw + srpBBuf.raw)).hex, 16);
  const ux = u.multiply(x);
  const uxa = ux.add(a);

  const S = bkgx.modPow(uxa, p);
  const SBuf = phex(256, S.toString(16));

  const K = sha256(SBuf.raw);
  const h1 = sha256(pBuf.raw);
  const h2 = sha256(gBuf.raw);
  const h12 = Bytes.xor(new Bytes(h1), new Bytes(h2));

  const M1 = sha256(h12.raw + sha256(clientSalt.raw) + sha256(serverSalt.raw) + AcBuf.raw + srpBBuf.raw + K);

  return {
    _: 'inputCheckPasswordSRP',
    srp_id: srpId,
    A: AcBuf.hex,
    M1: new Bytes(M1).hex,
  };
}
