// @flow

import type { Message } from './message';
import type { MessageHeaders } from '../serialization';
import type { TLAny } from './tl';

import { AuthService, SessionService, RPCService } from '../services';

/** RPC Result generic type */
export type RPCResult = { result: TLAny, headers: MessageHeaders };

/**
 * Transport interface is used to transmit type language serialized message to server with specific protocol, such as http or websocket
 * @param {TypeLanguage} tl Type language handler
 * @param {object} services Attached services
 */
export interface Transport {
  /**
   * Method ecnrypts serialized message and sends it to the server
   * @param {TLConstructor | Message | string} query Constructor name or data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders | Object} args Constructor data or message headers
   * @param {MessageHeaders} aargs Message headers
   * @returns {Promise<RPCResult>} Promise response wrapped by type language constructor
   */
  call(query: TLAny | Message | string, args?: MessageHeaders | Object, aargs?: MessageHeaders): Promise<RPCResult>;

  /**
   * Method sends plain message to the server
   * @param {TLConstructor | Message | string} query Constructor name or data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders | Object} args Constructor data or message headers
   * @param {MessageHeaders} aargs Message headers
   * @returns {Promise<RPCResult>} Promise response wrapped by type language constructor
   */
  callPlain(query: TLAny | Message | string, args?: MessageHeaders | Object, aargs?: MessageHeaders): Promise<RPCResult>;

  /** API Layer */
  APILayer: number;

  /** Attached services */
  services: {
    auth: AuthService;
    session: SessionService;
    rpc: RPCService;
  };
}
