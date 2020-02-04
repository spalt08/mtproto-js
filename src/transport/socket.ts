import Transport, { TransportConfig, TransportCallback } from './abstract';
import { logs } from '../utils/log';
import { Bytes } from '../serialization';
import {
  PlainMessage,
  bytesToMessage,
  EncryptedMessage,
} from '../message';
import {
  Abridged,
  Intermediate,
  IntermediatePadded,
  Full,
  Obfuscation,
} from './protocol';

/** Configuration object for WebSocket transport */
type SocketConfig = TransportConfig & {
  protocol: string,
};

/** Format debug messages if debug flag is enabled */
const debug = (cfg: SocketConfig, ...rest: any[]) => {
  if (cfg.debug) logs('socket')(`[dc: ${cfg.dc}, thread: ${cfg.thread}`, ...rest);
};

export default class Socket extends Transport {
  /** Connection handler */
  ws: WebSocket | undefined;

  /** Pending Requests */
  pending: Array<PlainMessage | EncryptedMessage> = [];

  /** WebSocket Config */
  cfg: SocketConfig;

  /** WebSocket State */
  state = 0; // 0 - disconnected, 1 - connecting, 2 - connected

  /** Instance transport */
  transport = 'websocket';

  /** Transport protocol */
  protocol?: Abridged | Intermediate | IntermediatePadded | Full;

  /** Transport obfuscation */
  obfuscation?: Obfuscation;

  /**
   * Creates new web socket handler
   */
  constructor(receiver: TransportCallback, cfg: SocketConfig) {
    super(receiver, cfg);

    this.cfg = cfg;
    this.connect();
  }

  connect = () => {
    this.ws = new WebSocket(`ws${this.cfg.ssl ? 's' : ''}://${this.cfg.host}/apiws${this.cfg.test ? '_test' : ''}`, 'binary');
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.handleOpen;
    this.ws.onclose = this.handleClose;
    this.ws.onmessage = this.handleMessage;
    this.state = 1;
  };

  /**
   * Handles onopen event at websocket object
   */
  handleOpen = () => {
    if (!this.ws) return;

    this.obfuscation = new Obfuscation();

    // select protocol
    switch (this.cfg.protocol) {
      case 'abridged': this.protocol = new Abridged(); break;
      case 'intermediate_padded': this.protocol = new IntermediatePadded(); break;
      case 'full': this.protocol = new Full(); break;
      default: this.protocol = new Intermediate();
    }

    // init obfuscation with first packet
    const initPayload = this.obfuscation.init(this.protocol.header);
    this.ws.send(initPayload.buffer.buffer);

    this.state = 2;
    this.releasePending();

    debug(this.cfg, 'opened');
  };

  /**
   * Handles onclose event at websocket object
   */
  handleClose = (_event: CloseEvent) => {
    this.state = 0;

    // todo: pass closing event;

    debug(this.cfg, 'closed');
  };

  /**
   * Handles onmessage event at websocket object
   */
  handleMessage = (event: MessageEvent) => {
    if (!event.data || !this.protocol || !this.obfuscation) return;

    const data = this.protocol.unWrap(this.obfuscation.decode(new Bytes(event.data)));
    const msg = bytesToMessage(data);

    // pass message to main client thread
    this.pass(this.cfg, msg);
  };

  /**
   * Method sends bytes to server via web socket.
   */
  send(msg: PlainMessage | EncryptedMessage) {
    // send if socket is ready
    if (this.obfuscation && this.protocol && this.ws && this.ws.readyState === 1) {
      const frame = this.obfuscation.encode(this.protocol.wrap(msg.buf)).buffer.buffer;
      this.ws.send(frame);

    // else: add message to pending quene and reconnect
    } else {
      this.pending.push(msg);
      if (this.state !== 1) this.connect();
    }
  }

  /**
   * Re-sends pending messages
   */
  releasePending() {
    if (this.pending) {
      for (let i = 0; i < this.pending.length; i += 1) {
        const msg = this.pending.shift();
        if (msg) this.send(msg);
      }
    }
  }
}
