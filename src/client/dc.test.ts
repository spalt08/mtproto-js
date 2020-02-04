/* eslint-disable max-len */
import DCService from './dc';
import metaMock from '../mock/client_meta';
import authKeyMock from '../mock/auth_key';
import { ClientMeta } from './types';

test('update service | getHost', () => {
  let changed = 0;
  const onMetaChange = (_meta: ClientMeta) => {
    changed += 1;
  };

  const service = new DCService(metaMock, onMetaChange);
  const salt = '1234';
  const session = '45678';

  expect(service.getHost(2)).toBe('venus-1.web.telegram.org');

  service.setMeta(2, 'tempKey', authKeyMock);
  service.setMeta(2, 'permKey', authKeyMock);
  service.setMeta(2, 'salt', salt);
  service.setMeta(2, 'sessionID', session);
  service.setMeta(2, 'connectionInited', true);
  service.setMeta(2, 'userID', 1);

  expect(service.getAuthKey(2)).toBe(authKeyMock);
  expect(service.getPermKey(2)).toBe(authKeyMock);
  expect(service.getSalt(2)).toBe(salt);
  expect(service.getSessionID(2)).toBe(session);
  expect(service.getConnectionStatus(2)).toBe(true);
  expect(service.getUserID(2)).toBe(1);
  expect(service.nextSeqNo(2, true)).toBe(3);
  expect(service.nextSeqNo(2, false)).toBe(4);
  expect(service.nextSeqNo(2, true)).toBe(5);

  expect(changed).toBe(8);
});
