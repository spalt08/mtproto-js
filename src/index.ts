import {
  Abridged,
  Intermediate,
  IntermediatePadded,
  Full,
  Obfuscation,
} from './transport/protocol';

export {
  TLConstructor,
  TLBytes,
  TLBollean,
  TLFlags,
  TLNumber,
  TLAbstract,
  TLVector,
} from './tl';

export const Transport = {
  Abridged,
  Intermediate,
  IntermediatePadded,
  Full,
  Obfuscation,
};

export { default as TypeLanguage } from './tl';

export { Client } from './client';

export { hex, Bytes } from './serialization';

/** Type Shortcuts */
export type Transports = import('./client/types').Transports;
export type ClientError = import('./client/types').ClientError;
export type AuthKey = import('./client/types').AuthKey;
export type TransportState = import('./transport/abstract').TransportState;