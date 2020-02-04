/* eslint-disable no-console */

export function log(...args: unknown[]) {
  console.log('[main]', ...args);
}

export function logs(scope: string, prefix: string = ''): (...args: unknown[]) => void {
  return (...args: unknown[]) => {
    console.log(`${prefix}[${scope}]`, ...args);
  };
}
