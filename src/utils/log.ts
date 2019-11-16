/* eslint-disable no-console */

const debug = window.localStorage.getItem('debugmt');

export function log(...args: unknown[]) {
  if (debug) console.log('[main]', ...args);
}

export function logs(scope: string): (...args: unknown[]) => void {
  return (...args: unknown[]) => {
    if (debug) console.log(`[${scope}]`, ...args);
  };
}
