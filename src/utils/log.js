// @flow

import debug from 'debug';
import getTime from './timer';

const logMain = console.log; //debug('main');

export function log(message: string, ...args: any) {
  logMain(`[${getTime().offset}] ${message}`, ...args);
}

export function logs(scope: string = 'main', message: string, ...args) {
  // debug(scope)(`[${getTime().offset}] ${message}`, ...args);
  logMain(`${scope} [${getTime().offset}] ${message}`, ...args);
}
