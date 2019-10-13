// @flow

import type TLConstructor from '../typeLanguage/constructor';
import type { Message } from './message';

/**
 * Transport interface is used to transmit type language serialized message to server with specific protocol, such as http or websocket
 * @param {TypeLanguage} tl Type language handler
 * @param {object} services Attached services
 */
export interface Transport {
  /**
   * Method ecnrypts serialized message and sends it to the server
   * @param {TLConstructor | GenericBuffer} query Data to send, wrapped at tl constructor or generic buffer
   * @returns {Promise<TLConstructor>} Promise response wrapped by type language constructor
   */
  call(query: TLConstructor | Message): Promise<TLConstructor>;

  /**
   * Method sends plain message to the server
   * @param {TLConstructor | Message} query Data to send, wrapped at tl constructor or generic buffer
   * @returns {Promise<TLConstructor>} Promise response wrapped by type language constructor
   */
  callPlain(query: TLConstructor | Message): Promise<TLConstructor>;
}
