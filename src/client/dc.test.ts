/* eslint-disable max-len */
import DCService from './dc';
import metaMock from '../mock/client_meta';
import { permanentKey, temporaryKey } from '../mock/auth_key';
import { ClientMeta } from './types';

test('dc service | common', () => {
  let changed = 0;

  const onMetaChange = (_meta: ClientMeta) => {
    changed += 1;
  };

  const service = new DCService(metaMock, onMetaChange);
  const salt = '1234567812345678';
  const session = '0102030401020304';
  const userID = 123456;

  expect(service.getHost(2)).toBe('venus-1.web.telegram.org');
  expect(service.getUserID()).toBe(null);

  service.setPermanentKey(2, permanentKey);
  service.setTemporaryKey(2, temporaryKey);
  service.setSalt(2, salt);
  service.setKeyBinding(2);
  service.setAuthorization(2, userID);
  service.setConnection(2);

  expect(service.meta).toEqual({
    ...metaMock,
    userID,
    dcs: {
      2: {
        temporaryKey: {
          ...temporaryKey,
          binded: true,
        },
        permanentKey,
        salt,
        authorized: true,
        inited: true,
      },
    },
  });

  expect(service.getUserID()).toBe(userID);
  expect(changed).toEqual(6);

  service.setBaseDC(3);
  expect(service.meta.baseDC).toEqual(3);

  expect(changed).toEqual(7);

  service.setSessionID(2, session);

  expect(service.sessions).toEqual({ 2: session });
  expect(service.getSessionID(2)).toEqual(session);

  expect(service.getAuthKey(2)).toBe(temporaryKey);
  expect(service.getKeyBinding(2)).toBe(true);
  expect(service.getConnection(2)).toBe(true);

  service.setTemporaryKey(2, null);
  expect(service.getAuthKey(2)).toBe(null);

  expect(service.getAuthKey(3)).toBe(null);
  expect(service.getPermanentKey(3)).toBe(null);

  service.meta.pfs = false;

  expect(service.getAuthKey(2)).toBe(permanentKey);

  expect(service.nextSeqNo(3, true)).toBe(3);
  expect(service.nextSeqNo(3)).toBe(4);
  expect(service.nextSeqNo(3, true)).toBe(5);

  expect(service.getKeyBinding(2)).toBe(false);
  expect(service.getAuthorization(2)).toBe(true);
  expect(service.getConnection(2)).toBe(false);
  expect(service.getSalt(2)).toBe(salt);

  expect(service.pfs()).toBe(false);

  expect(service.getSalt(3)).not.toBe('');
  expect(service.getSessionID(3)).not.toBe('');


  expect(service.getPermanentKey(2)).toEqual(permanentKey);

  expect(service.getKeyBinding(3)).toEqual(false);
  expect(service.getAuthKey(3)).toBe(null);
});
