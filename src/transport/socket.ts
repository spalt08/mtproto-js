import Transport, { TransportConfig } from './abstract';
import { PlainMessage, Message } from '../message';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import async from '../crypto/async';
import { MTProtoTransport } from './protocol';
import { DCService } from '../client';

const log = logs('socket');

/** Configuration object for WebSocket transport */
type SocketConfig = TransportConfig & {
  protocol: MTProtoTransport,
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
    log(this.cfg.dc, 'opened');

    async('transport_init', [this.cfg.dc, this.cfg.protocol], (initPayload: string) => {
      if (!this.ws) return;

      this.ws.send(hex(initPayload).buffer.buffer);

      this.isConnecting = false;

      log(this.cfg.dc, 'ready');

      if (this.pending) {
        for (let i = 0; i < this.pending.length; i += 1) {
          const msg = this.pending.shift();
          if (msg) this.send(msg);
        }
      }
    });
  };

  /**
   * Handles onclose event at websocket object
   */
  handleClose = () => {
    log(this.cfg.dc, 'closed');
    this.emit('disconnected');
  };

  /**
   * Handles onmessage event at websocket object
   */
  handleMessage = (event: MessageEvent) => {
    const authKey = this.svc.getAuthKey(this.cfg.dc);

    if (!event.data) return;

    async('transport_decrypt', [this.cfg.dc, new Bytes(event.data).hex, authKey ? authKey.key : ''], (data: string[]) => {
      const [type, payload] = data;

      if (type === 'plain') {
        const msg = new PlainMessage(hex(payload));
        this.cfg.resolve(this.cfg.dc, this.cfg.thread, msg);
      }

      if (type === 'encrypted') {
        const msg = new Message(hex(payload));
        this.cfg.resolve(this.cfg.dc, this.cfg.thread, msg);
      }
    });
  };

  /**
   * Method sends bytes to server via web socket.
   */
  send(msg: PlainMessage | Message) {
    if (this.ws && this.ws.readyState === 1) {
      const authKey = this.svc.getAuthKey(this.cfg.dc);

      async('transport_encrypt', [this.cfg.dc, msg.buf.hex, authKey ? authKey.key : ''], (data: string) => {
        if (this.ws) this.ws.send(hex(data).buffer.buffer);
      });

      return;
    }

    if (this.isConnecting === false) this.connect();
    this.pending.push(msg);
  }
}
