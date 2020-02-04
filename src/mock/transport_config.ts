import { Transports } from 'client/types';

export default {
  test: true,
  debug: false,
  ssl: true,
  dc: 2,
  host: 'venus.web.telegram.org',
  thread: 1,
  transport: 'websocket' as Transports,
};
