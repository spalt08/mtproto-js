import Transport, { TransportConfig } from './abstract';
import { PlainMessage, Message, EncryptedMessage } from '../message';
import { logs } from '../utils/log';
import { Bytes } from '../serialization';
import { DCService } from '../client';
import {
  Abridged,
  Intermediate,
  IntermediatePadded,
  Full,
  Obfuscation,
} from './protocol';

const log = logs('socket');

/** Configuration object for WebSocket transport */
type SocketConfig = TransportConfig & {
  protocol: string,
};

export default class Socket extends Transport {
  /** Connection handler */
  ws: WebSocket | undefined;

  /** Pending Requests */
  pending: Array<PlainMessage | Message> = [];

  /** WebSocket Config */
  cfg: SocketConfig;

  /** WebSocket connecting flag */
  isConnecting = false;

  /** Instance transport */
  transport = 'websocket';

  /** Last plain message nonce */
  lastNonce: string | null = null;

  /** Transport protocol */
  protocol?: Abridged | Intermediate | IntermediatePadded | Full;

  /** Transport obfuscation */
  obfuscation?: Obfuscation;

  /**
   * Creates new web socket handler
   */
  constructor(svc: DCService, cfg: SocketConfig) {
    super(svc, cfg);

    this.cfg = cfg;

    this.connect();
  }

  connect = () => {
    this.ws = new WebSocket(`ws${this.cfg.ssl ? 's' : ''}://${this.svc.getHost(this.cfg.dc)}/apiws${this.cfg.test ? '_test' : ''}`, 'binary');
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.handleOpen;
    this.ws.onclose = this.handleClose;
    this.ws.onmessage = this.handleMessage;
    this.isConnecting = true;
  };

  /**
   * Handles onopen event at websocket object
   */
  handleOpen = () => {
    if (!this.ws) return;

    log(this.cfg.dc, 'opened');

    this.obfuscation = new Obfuscation();

    switch (this.cfg.protocol) {
      case 'abridged': this.protocol = new Abridged(); break;
      case 'intermediate_padded': this.protocol = new IntermediatePadded(); break;
      case 'full': this.protocol = new Full(); break;
      default: this.protocol = new Intermediate();
    }

    const initPayload = this.obfuscation.init(this.protocol.header);

    this.ws.send(initPayload.buffer.buffer);
    this.isConnecting = false;
    this.releasePending();
  };

  /**
   * Handles onclose event at websocket object
   */
  handleClose = (event: CloseEvent) => {
    log(this.cfg.dc, 'closed');
    this.emit('disconnected');
    this.pending = [];
    this.isConnecting = false;
    this.cfg.resolveError(this.cfg.dc, this.cfg.thread, this.transport, this.lastNonce || '', event.code, event.reason);
  };

  /**
   * Handles onmessage event at websocket object
   */
  handleMessage = (event: MessageEvent) => {
    const authKey = this.svc.getAuthKey(this.cfg.dc);

    if (!event.data || !this.protocol || !this.obfuscation) return;

    let msg: PlainMessage | EncryptedMessage | Message = this.protocol.unWrap(this.obfuscation.decode(new Bytes(event.data)));

    if (msg instanceof PlainMessage) this.lastNonce = msg.nonce;
    if (msg instanceof EncryptedMessage) {
      if (!authKey) throw new Error('Unable to descrpt message without auth key');

      try {
        msg = msg.decrypt(authKey.key);
      } catch (e) {
        log(this.cfg.dc, 'failed to decrypt message');
      }
    }

    if (msg instanceof Message || msg instanceof PlainMessage) {
      this.cfg.resolve(msg, {
        dc: this.cfg.dc,
        thread: this.cfg.thread,
        transport: this.transport,
        msgID: msg.id,
      });
    } else {
      throw new Error(`Unexpected answer: ${msg.buf.hex}`);
    }
  };

  /**
   * Method sends bytes to server via web socket.
   */
  send(msg: PlainMessage | Message) {
    log('<-', msg.id, `(dc: ${this.cfg.dc}, thread: ${this.cfg.thread})`);

    if (msg instanceof PlainMessage) this.lastNonce = msg.nonce;

    // send if socket is ready
    if (this.obfuscation && this.protocol && this.ws && this.ws.readyState === 1) {
      const authKey = this.svc.getAuthKey(this.cfg.dc);
      let frame: ArrayBuffer;

      if (msg instanceof PlainMessage) {
        frame = this.obfuscation.encode(this.protocol.wrap(msg.buf)).buffer.buffer;
      } else {
        if (!authKey) throw new Error('Trying to send encrypted message without auth key');

        const encrypted = msg.encrypt(authKey.key);
        frame = this.obfuscation.encode(this.protocol.wrap(encrypted.buf)).buffer.buffer;
      }

      this.ws.send(frame);
      this.releasePending();

    // else: add message to pending quene and reconnect
    } else {
      this.pending.push(msg);
      if (this.isConnecting === false) this.connect();
    }
  }

  releasePending() {
    if (this.pending) {
      for (let i = 0; i < this.pending.length; i += 1) {
        const msg = this.pending.shift();
        if (msg) this.send(msg);
      }
    }
  }
}
