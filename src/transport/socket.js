// @flow

import type { GenericTranportConfig } from './abstract';
import type { MessageHeaders } from '../serialization';
import type {
  Transport, TLAny, Message, TransportProtocol, RPCResult,
} from '../interfaces';

import TypeLanguage from '../tl';
import TLConstructor from '../tl/constructor';
import AbstractTransport from './abstract';
import { MessagePlain, MessageEncrypted, MessageData } from '../serialization';
import { encryptDataMessage, decryptDataMessage } from '../crypto/aes/message';
import { logs } from '../utils/log';
import { Abridged, TransportObfuscation } from './protocol';

const log = logs('socket');

/** Configuration object for WebSocket transport */
type SocketConfig = GenericTranportConfig & {
  ssl?: boolean,
  protocol: TransportProtocol,
};

/** Default configuration for HTTP transport */
const defaultConfig = {
  ssl: false,
  protocol: new Abridged(),
};

export default class Socket extends AbstractTransport implements Transport {
  /** Web Socket Handler */
  ws: WebSocket;

  /** MTProto Transport Protocol */
  protocol: TransportProtocol;

  /** MTProto Transport Protocol */
  obfuscation: TransportObfuscation;

  /** Is Socket ready */
  isReady: boolean = false;

  /** On connect callback */
  connectCb: () => any;

  /** Quene of promise resolve functions for plain requests */
  plainResolvers: Array<{ resolve: (RPCResult) => any, reject: (any) => any }>;

  /**
   * Creates new web socket handler
   * @param {string} addr Server address or IP
   * @param {TypeLanguage} tl Type language handler
   * @param {object} cfg Transport Configuration
   */
  constructor(addr: string, tl: TypeLanguage, extCfg?: SocketConfig) {
    super(tl, extCfg);

    const cfg: SocketConfig = { ...defaultConfig, ...extCfg };

    this.protocol = cfg.protocol;
    this.obfuscation = new TransportObfuscation();
    this.plainResolvers = [];

    this.ws = new WebSocket(`ws${cfg.ssl ? 's' : ''}://${addr}/apiws`, 'binary');
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.handleOpen;
    this.ws.onmessage = this.handleMessage;
  }

  connect(): Promise<any> {
    return new Promise((resolve: () => any) => {
      if (this.isReady) {
        resolve();
      } else {
        this.connectCb = resolve;
      }
    });
  }

  /**
   * Handles onopen event at websocket object
   */
  handleOpen = async () => {
    log('opened');

    const initPayload = this.obfuscation.init(this.protocol.header);
    this.ws.send(initPayload);

    await this.auth.prepare();
    await this.session.prepare();
    await this.updates.prepare();

    log('ready');

    this.isReady = true;

    if (this.connectCb) this.connectCb();
  }

  /**
   * Handles onmessage event at websocket object
   * @param {MessageEvent} event Websocket Message Event
   */
  handleMessage = (event: MessageEvent) => {
    if (event.data instanceof ArrayBuffer) {
      const msg = this.protocol.unWrap(this.obfuscation.decode(event.data));

      if (msg instanceof MessagePlain) {
        const firstPromise = this.plainResolvers.shift();
        firstPromise.resolve({ result: this.tl.parse(msg), headers: { msgID: msg.getMessageID() } });
      }

      if (msg instanceof MessageEncrypted) {
        const decryptedMsg = decryptDataMessage(this.auth.tempKey, msg);
        const response = { result: this.tl.parse(decryptedMsg), headers: { msgID: decryptedMsg.getMessageID() } };
        console.log(response.result.json());
        this.rpc.processMessage(response);
      }
    }
  }

  /**
   * Method ecnrypts serialized message and sends it to the server
   * @param {TLConstructor | Message | string} query Constructor number or data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders | Object} args Constructor data or message headers
   * @param {MessageHeaders} args Message headers
   * @returns {Promise<RPCResult>} Promise response wrapped by type language constructor
   */
  call(query: TLAny | Message | string, args?: MessageHeaders | Object = {}, aargs: MessageHeaders = {}): Promise<RPCResult> {
    let msg = new MessageData();
    let tlHandler = query;
    let headers = aargs;

    if (query instanceof MessageData) {
      msg = query;
    } else if (typeof query === 'string') {
      tlHandler = this.tl.create(query, args);
      headers = aargs;
    } else if (tlHandler instanceof TLConstructor) {
      headers = args;
    }

    if (tlHandler instanceof TLConstructor) {
      const isContentRelated = tlHandler._ !== 'msgs_ack' && tlHandler._ !== 'http_wait';

      msg = new MessageData(tlHandler.serialize())
        .setSessionID(headers.sessionID || this.session.sessionID)
        .setSalt(headers.serverSalt || this.session.serverSalt)
        .setMessageID(headers.msgID)
        .setSequenceNum(headers.seqNum || this.session.nextSeqNum(isContentRelated))
        .setLength()
        .setPadding();
    }

    this.send(encryptDataMessage(this.auth.tempKey, msg));

    return this.rpc.subscribe(msg);
  }

  /**
   * Method sends plain message to the server
   * @param {TLConstructor | Message | string} query Constructor number or data to send, wrapped at tl constructor or generic buffer
   * @param {MessageHeaders | Object} args Constructor data or message headers
   * @param {MessageHeaders} args Message headers
   * @returns {Promise<RPCResult>} Promise response wrapped by type language constructor
   */
  callPlain(query: TLAny | Message | string, args?: MessageHeaders | Object = {}, aargs: MessageHeaders = {}): Promise<RPCResult> {
    let tlHandler = query;
    let msg = new MessagePlain();
    let headers = aargs;

    if (query instanceof MessagePlain) {
      msg = query;
    } else if (typeof query === 'string') {
      tlHandler = this.tl.create(query, args);
      headers = aargs;
    } else if (tlHandler instanceof TLConstructor) {
      headers = args;
    }

    if (tlHandler instanceof TLConstructor) {
      msg = new MessagePlain(tlHandler.serialize())
        .setMessageID(headers.msgID)
        .setLength();
    }

    this.send(msg);

    return new Promise((resolve: (RPCResult) => any, reject: (any) => any) => {
      this.plainResolvers.push({ resolve, reject });
    });
  }

  /**
   * Method sends bytes to server via web socket.
   * @param {Message} msg Message interface
   */
  send(msg: MessagePlain | MessageEncrypted) {
    this.ws.send(
      this.obfuscation.encode(
        this.protocol.wrap(msg),
      ),
    );
  }
}
