/* eslint-disable no-restricted-globals */
import Transport, { TransportConfig, TransportCallback, TransportState } from './abstract';
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
  if (cfg.debug) logs('socket')('[dc:', cfg.dc, 'thread:', cfg.thread, ']', ...rest);
};

export default class Socket extends Transport {
  /** Connection handler */
  ws: WebSocket | undefined;

  /** Pending Requests */
  pending: Array<PlainMessage | EncryptedMessage> = [];

  /** WebSocket Config */
  cfg: SocketConfig;

  /** Instance transport */
  transport = 'websocket';

  /** Transport protocol */
  protocol?: Abridged | Intermediate | IntermediatePadded | Full;

  /** Transport obfuscation */
  obfuscation?: Obfuscation;

  /** Last connect retry */
  lastConnectRetry = 0;

  /** Reconnect timer */
  reconnectTimer?: number;

  /** Request timeout timer */
  requestTimer?: number;

  /** Transport state */
  state: TransportState = 'disconnected';

  /**
   * Creates new web socket handler
   */
  constructor(receiver: TransportCallback, cfg: SocketConfig) {
    super(receiver, cfg);

    this.cfg = cfg;
    this.connect();

    if (self) {
      self.addEventListener('online', () => {
        this.connect();
      });

      self.addEventListener('offline', () => {
        if (this.ws) this.ws.close();
      });
    }
  }

  notify = (status: TransportState) => {
    if (status !== this.state) {
      this.pass(this.cfg, status);
      this.state = status;
    }
  };

  connect = (force?: boolean) => {
    if (this.ws && this.ws.readyState <= 1) return;

    const timestamp = Date.now();

    // forced connect
    if (force) {
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    // auto connect should be throttled
    } else if (timestamp - this.lastConnectRetry < 1000) {
      this.reconnectTimer = setTimeout(this.connect as TimerHandler, 3000);
      return;
    }

    this.reconnectTimer = 0;

    if (navigator.onLine !== false) {
      this.lastConnectRetry = timestamp;

      this.ws = new WebSocket(`ws${this.cfg.ssl ? 's' : ''}://${this.cfg.host}/apiws${this.cfg.test ? '_test' : ''}`, 'binary');
      this.ws.binaryType = 'arraybuffer';
      this.ws.onopen = this.handleOpen;
      this.ws.onclose = this.handleClose;
      this.ws.onmessage = this.handleMessage;
    }
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

    // notify client
    this.notify('connected');

    // init obfuscation with first packet
    const initPayload = this.obfuscation.init(this.protocol.header);
    this.ws.send(initPayload.buffer.buffer);

    // release pending messages
    this.releasePending();

    debug(this.cfg, 'opened');
  };

  /**
   * Handles onclose event at websocket object
   */
  handleClose = (_event: CloseEvent) => {
    debug(this.cfg, 'closed');

    // notify client
    this.notify('disconnected');

    // keep connection for 1st threads
    if (this.cfg.thread === 1) this.connect();
  };

  /**
   * Handles onmessage event at websocket object
   */
  handleMessage = (event: MessageEvent) => {
    if (!event.data || !this.protocol || !this.obfuscation) return;

    // notify client
    if (this.state !== 'connected') this.notify('connected');

    // process message
    const data = this.protocol.unWrap(this.obfuscation.decode(new Bytes(event.data)));
    const msg = bytesToMessage(data);

    // flush request timer
    if (msg instanceof EncryptedMessage) {
      if (this.requestTimer) {
        clearTimeout(this.requestTimer);
        this.requestTimer = 0;
      }
    }

    // pass message to main client thread
    this.pass(this.cfg, msg);
  };

  /**
   * Handles request timeout
   */
  handleRequestTimout = () => {
    debug(this.cfg, 'waiting');

    // notify client
    this.notify('waiting');
  };

  /**
   * Method sends bytes to server via web socket.
   */
  send(msg: PlainMessage | EncryptedMessage) {
    // send if socket is ready
    if (this.obfuscation && this.protocol && this.ws && this.ws.readyState === 1) {
      const frame = this.obfuscation.encode(this.protocol.wrap(msg.buf)).buffer.buffer;
      this.ws.send(frame);
      debug(this.cfg, '<-', msg);

      // delay request timeout handler
      if (msg instanceof EncryptedMessage && msg.isContentRelated && !this.requestTimer) {
        this.requestTimer = setTimeout(this.handleRequestTimout as TimerHandler, 5000);
      }

    // else: add message to pending quene and reconnect
    } else {
      debug(this.cfg, 'pending', (msg as any).nonce || (msg as any).key);
      this.pending.push(msg);
      if (!this.ws || this.ws.readyState !== 0) this.connect(true);
    }
  }

  /**
   * Re-sends pending messages
   */
  releasePending() {
    if (this.pending) {
      const num = this.pending.length;
      for (let i = 0; i < num; i += 1) {
        const msg = this.pending.shift();
        debug(this.cfg, 'release pending', (msg as any).nonce || (msg as any).key);
        if (msg) this.send(msg);
      }
    }
  }
}
