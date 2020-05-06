import { Transports } from 'client/types';

export default {
  test: true,
  debug: false,
  ssl: true,
  dc: 2,
  host: 'venus.web.telegram.org',
  thread: 1,
  transport: 'websocket' as Transports,
  APILayer: 113,
  APIID: 1194894,
  APIHash: 'a4aed71c0c88a9db8eccb29e9a1d90f3',

  deviceModel: 'test',
  systemVersion: 'test',
  appVersion: '1.0',
  langCode: 'en',
};
