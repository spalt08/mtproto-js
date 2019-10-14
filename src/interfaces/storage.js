// @flow

/**
 * Storage interface is used to store mtproto values, such as authKey, sessionID, etc.
 */
export interface DataStorage {
  /**
   * Method saves value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @param {any} value Value itself of any type
   */
  save(namespace: string, key: string, value: any): void;

  /**
   * Method gets value of any type
   * @param {string} namespace Value namespace
   * @param {string} key Value key
   * @returns {any} Value itself of any type
   */
  load(namespace: string, key: string): any;

  /**
   * Values that can be stored {namespace.key: valueType}
   *
   * auth.AuthKeyTemp: stirng
   * auth.AuthKeyTempExpire: number
   * auth.AuthKeyPerm: stirng
   * session.SessionID: string
   * session.Expire: number
   * session.ServerSalt: string
   * session.NextServerSalt: string
   */
}
