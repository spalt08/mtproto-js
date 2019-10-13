// @flow

import type { Hex } from '../serialization';

export interface Message {
  getMessageID(): Hex;
}
