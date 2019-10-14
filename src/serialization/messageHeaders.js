// @flow

import Hex from './hex';

/** Message headers object type */
export type MessageHeaders = {
  sessionID?: Hex,
  serverSalt?: Hex,
  msgID?: Hex,
  seqNum?: number,
};
