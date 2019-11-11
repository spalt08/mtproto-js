import Transport, { TransportConfig } from './abstract';
import { PlainMessage, Message } from '../message';
import { logs } from '../utils/log';
import { Bytes } from '../serialization';
import async from '../crypto/async';
import { DCService } from '../client';

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

    const { dc, thread, protocol } = this.cfg;
    const payload = {
      dc, thread, protocol, transport: 'websocket',
    };

    async('transport_init', payload, (initPayload: Bytes) => {
      if (!this.ws) return;

      this.ws.send(initPayload.buffer.buffer);

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
    const { dc, thread } = this.cfg;
    const payload = {
      dc, thread, transport: 'websocket', authKey: authKey ? authKey.key : '', msg: new Bytes(event.data),
    };

    if (!event.data) return;

    async('transport_decrypt', payload, (msg: Message | PlainMessage | Bytes) => {
      if (msg instanceof Message || msg instanceof PlainMessage) {
        this.cfg.resolve(this.cfg.dc, this.cfg.thread, msg);
      } else {
        throw new Error(`Unexpected answer: ${msg.hex}`);
      }
    });
  };

  /**
   * Method sends bytes to server via web socket.
   */
  send(msg: PlainMessage | Message) {
    if (this.ws && this.ws.readyState === 1) {
      const authKey = this.svc.getAuthKey(this.cfg.dc);
      const { dc, thread } = this.cfg;
      const payload = {
        msg, dc, thread, transport: 'websocket', authKey: authKey ? authKey.key : '',
      };

      async('transport_encrypt', payload, (data: Bytes) => {
        if (this.ws) this.ws.send(data.buffer.buffer);
      });

      return;
    }

    if (this.isConnecting === false) this.connect();
    this.pending.push(msg);
  }
}
