import TypeLanguage, { TLNumber } from '../tl';
import TLConstructor from '../tl/constructor';
import Transport, { GenericTranportConfig, ResponseCallback } from './abstract';
import { PlainMessage, EncryptedMessage } from '../message';
import { logs } from '../utils/log';
import {
  Abridged,
  IntermediatePadded,
  Intermediate,
  Full,
  Obfuscation,
} from './protocol';
import { Bytes } from '../serialization';

const log = logs('socket');

type MTProtoTransport = Abridged | Intermediate | IntermediatePadded | Full;

/** Configuration object for WebSocket transport */
type SocketConfig = GenericTranportConfig & {
  ssl?: boolean,
  protocol: MTProtoTransport,
};

/** Default configuration for HTTP transport */
const defaultConfig = {
  APILayer: 105,
  ssl: false,
  protocol: new Intermediate(),
};

export default class Socket extends Transport {
  /** Web Socket Handler */
  ws: WebSocket;

  /** MTProto Transport Protocol */
  protocol: MTProtoTransport;

  /** MTProto Transport Protocol */
  obfuscation: Obfuscation;

  /** Quene of reponse callbacks for plain requests */
  plainResolvers: Record<string, ResponseCallback> = {};

  /** Event listeners */
  events: Record<string, Array<() => void>> = {};

  /**
   * Creates new web socket handler
   */
  constructor(tl: TypeLanguage, extCfg?: SocketConfig) {
    super(tl, extCfg);

    const cfg: SocketConfig = { ...defaultConfig, ...extCfg };

    this.protocol = cfg.protocol;
    this.obfuscation = new Obfuscation();

    this.ws = new WebSocket(`ws${cfg.ssl ? 's' : ''}://${this.dc.getHost()}/apiws`, 'binary');
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.handleOpen;
    this.ws.onclose = this.handleClose;
    this.ws.onmessage = this.handleMessage;
  }

  /**
   * Handles onopen event at websocket object
   */
  handleOpen = () => {
    log('opened');

    const initPayload = this.obfuscation.init(this.protocol.header);
    this.ws.send(initPayload.buffer.buffer);

    log('ready');

    this.emit('ready');
  };

  /**
   * Handles onclose event at websocket object
   */
  handleClose = () => {
    log('closed');

    this.emit('disconnected');
  };

  /**
   * Handles onmessage event at websocket object
   */
  handleMessage = (event: MessageEvent) => {
    if (event.data instanceof ArrayBuffer) {
      const msg = this.protocol.unWrap(this.obfuscation.decode(new Bytes(event.data)));

      if (msg instanceof PlainMessage) {
        const result = this.tl.parse(msg.data);

        if (result instanceof TLConstructor && result.params.nonce instanceof TLNumber && result.params.nonce.buf) {
          msg.nonce = result.params.nonce.buf.hex;
        }

        if (msg.nonce && this.plainResolvers[msg.nonce]) {
          this.plainResolvers[msg.nonce](null, result, {
            msgID: msg.id,
          });
          delete this.plainResolvers[msg.nonce];
        }
      }

      if (msg instanceof EncryptedMessage) {
        console.log(msg);
      }
    }
  };

  /**
   * Method sends bytes to server via web socket.
   * @param {Message} msg Message interface
   */
  send(msg: PlainMessage | EncryptedMessage, cb: ResponseCallback) {
    if (msg instanceof PlainMessage) {
      this.plainResolvers[msg.nonce] = cb;
    }

    this.ws.send(
      this.obfuscation.encode(
        this.protocol.wrap(msg),
      ).buffer.buffer,
    );
  }

  /**
   * Subscribe to transport event
   */
  on(event: string, cb: () => {}): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(cb);
  }

  /**
   * Emit transport event
   */
  emit(event: string): void {
    if (this.events[event]) {
      for (let i = 0; i < this.events[event].length; i += 1) {
        this.events[event][i]();
      }
    }
  }
}
