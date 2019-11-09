/**
 * Default storage using native browser local storage
 */

type StorageKeyMap = 'authPermKey';

export default class DefaultStorage {
  /** Local storage key prefix */
  prefix: string = 'mtp-';

  /**
   * Creates an item key for native local storage
   */
  getLocalStorageKey(key: StorageKeyMap) {
    return `${this.prefix}-${key}`;
  }

  /**
   * Method saves value of any type
   */
  save(key: StorageKeyMap, value: any) {
    localStorage.setItem(this.getLocalStorageKey(key), JSON.stringify(value));
  }

  /**
   * Method gets value of any type
   */
  load(key: StorageKeyMap) {
    const valueStr = localStorage.getItem(this.getLocalStorageKey(key));

    if (valueStr) return JSON.parse(valueStr);

    return undefined;
  }
}
