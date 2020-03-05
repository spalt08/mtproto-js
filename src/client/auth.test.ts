/* eslint-disable max-len */
import TypeLanguage from '../tl';
import Client from './client';
import { createAuthKey, bindTempAuthKey, initConnection } from './auth';
import { AuthKey } from './types';

test('Auth | create key', () => {
  const tl = new TypeLanguage();
  const client = new Client(tl, {
    test: true,
    dc: 2,
    autoConnect: false,
    meta: {},
  });

  const async = new Promise<AuthKey>((resolve, reject) => {
    createAuthKey(client, 2, 1, 0, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  return async.then((key: AuthKey) => {
    if (!key) throw new Error('Key is nullable');
    expect(key.id.length).toBe(16);
  });
}, 60000);

test('Auth | binding and init session', () => {
  const tl = new TypeLanguage();

  tl.schema.define('auth.bindTempAuthKey#cdd42a05 perm_auth_key_id:long nonce:long expires_at:int encrypted_message:bytes = Bool');
  tl.schema.define('initConnection#785188b8 flags:# api_id:int device_model:string system_version:string app_version:string system_lang_code:string lang_pack:string lang_code:string proxy:flags.0?InputClientProxy query:!X = X');
  tl.schema.define('help.getNearestDc#1fb33026 = NearestDc');
  tl.schema.define('boolTrue#997275b5 = Bool');

  const client = new Client(tl, {
    test: true,
    dc: 2,
    autoConnect: false,
    meta: {},
  });

  const async = new Promise<boolean>((resolve, reject) => {
    createAuthKey(client, 2, 1, 0, (err, k) => {
      if (err) reject(err);
      if (!k) {
        reject(new Error('Expected perm auth key'));
        return;
      }

      const permKey = k;

      createAuthKey(client, 2, 1, 3600 * 1, (errp, kp) => {
        if (errp) reject(errp);
        if (!kp) {
          reject(new Error('Expected temp auth key'));
          return;
        }

        const tempKey = kp;

        bindTempAuthKey(client, 2, permKey, tempKey, (res) => {
          if (!res) reject(new Error('Expected binding'));
          else initConnection(client, 2, resolve);
        });
      });
    });
  });

  return async.then((result) => {
    expect(result).toBeTruthy();
  });
}, 150000);
