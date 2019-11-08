// @flow

import { Message } from './message';
import { MessageHeaders } from '../serialization';
import { TLAny } from './tl';

import {
  AuthService, SessionService, RPCService, UpdatesService,
} from '../services';

/** RPC Result generic type */
export type RPCResult = { result: TLAny, headers: MessageHeaders };

/**
 * Transport interface is used to transmit type language serialized message to server with specific protocol, such as http or websocket
 * @param {TypeLanguage} tl Type language handler
 * @param {AuthService} auth  Authorization service
 * @param {SessionService} session Session Service
 * @param {RPCService} rpc RPC Service
 * @param {number} APILayer Invoked api layer
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

  /** Authorization Service */
  auth: AuthService;

  /** Session Service */
  session: SessionService;

  /** Updates Service */
  updates: UpdatesService;

  /** RPC Service */
  rpc: RPCService;
}