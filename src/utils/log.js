// @flow

import debug from 'debug';

const logMain = debug('main');

export function log(message: string, ...args: any) {
  logMain(`${message}`, ...args);
}

export function logs(scope: string): (message: string, ...args: any) => any {
  return debug(scope);
}
