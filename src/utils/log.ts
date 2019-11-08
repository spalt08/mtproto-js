// @flow

export function log(...args: unknown[]) {
  console.log('[main]', ...args);
}

export function logs(scope: string): (...args: unknown[]) => void {
  return (...args: unknown[]) => {
    console.log(`[${scope}]`, ...args);
  };
}
