// @flow

/**
 * Default storage using native browser local storage
 */
export default class DefaultStorage {
  /** Local storage key prefix */
  prefix: string = 'mtp-';

  /**
   * Creates an item key for native local storage
   */
  getLocalStorageKey(namespace: string, key: string) {
    return `${this.prefix}${namespace}-${key}`;
  }

  /**
   * Method saves value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @param {any} value Value itself of any type
   */
  save(namespace: string, key: string, value: any) {
    // console.log('storage updated', namespace, key, value);
    localStorage.setItem(this.getLocalStorageKey(namespace, key), JSON.stringify(value));
  }

  /**
   * Method gets value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @returns {any} Value itself of any type
   */
  load(namespace: string, key: string): any {
    const valueStr = localStorage.getItem(this.getLocalStorageKey(namespace, key));

    if (valueStr) return JSON.parse(valueStr);

    return undefined;
  }
}
