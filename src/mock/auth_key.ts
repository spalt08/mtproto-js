import { AuthKey, AuthKeyNotNull } from '../client/types';

export const permanentKey: AuthKeyNotNull = {
  key: new Uint32Array(32),
  id: 'permID',
};

export const temporaryKey: AuthKeyNotNull = {
  key: new Uint32Array(32),
  id: 'tempID',
  expires: 12345679,
  binded: false,
};

export const nullKey: AuthKey = null;

export default permanentKey;
