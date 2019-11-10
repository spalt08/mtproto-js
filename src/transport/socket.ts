import TypeLanguage, { TLNumber } from '../tl';
import TLConstructor from '../tl/constructor';
import Transport, { GenericTranportConfig, ResponseCallback } from './abstract';
import { PlainMessage, Message } from '../message';
import { logs } from '../utils/log';
import { Bytes, hex } from '../serialization';
import async from '../crypto/async';

const log = logs('socket');

type MTProtoTransport = 'abridged' | 'intermediate' | 'intermediate_padded' | 'full';

/** Configuration object for WebSocket transport */
type SocketConfig = GenericTranportConfig & {
  ssl?: boolean,
  test?: boolean,
  protocol?: MTProtoTransport,
  skipAuth?: boolean,
};

interface WebSocketWithDC extends WebSocket {
  __dc: number;
}

export default class Socket extends Transport {
  /** Establish ssl connection */
  ssl: boolean;

  /** Use test servers */
  test: boolean;

  /** Web Socket Handlers */
  ws: Record<number, WebSocket>;

  /** MTProto Transport Protocol */
  protocol: string;

  /** Quene of reponse callbacks for plain requests */
  plainResolvers: Record<string, ResponseCallback> = {};

  /** Pending Requests */
  pending: Record<number, Array<PlainMessage | Message>> = {};

  /**
   * Creates new web socket handler
   */
  constructor(tl: TypeLanguage, cfg: SocketConfig = {}) {
    super(tl, cfg);

    this.protocol = cfg.protocol || 'intermediate';
    this.ssl = cfg.ssl || true;
    this.test = cfg.test || false;
    this.ws = {};

    this.connect(this.dc.default);
  }

  /**
   * Creates connection handler
   */
  connect = (dcID: number) => {
    this.ws[dcID] = new WebSocket(`ws${this.ssl ? 's' : ''}://${this.dc.getHost()}/apiws${this.test ? '_test' : ''}`, 'binary');
    (this.ws[dcID] as WebSocketWithDC).__dc = dcID;
    this.ws[dcID].binaryType = 'arraybuffer';
    this.ws[dcID].onopen = this.handleOpen;
    this.ws[dcID].onclose = this.handleClose;
    this.ws[dcID].onmessage = this.handleMessage;
  };

  /**
   * Handles onopen event at websocket object
   */
  handleOpen = (event: Event) => {
    if (!(event.currentTarget instanceof WebSocket)) return;

    const ws = event.currentTarget;
    const dc = (ws as WebSocketWithDC).__dc;

    log('opened', dc);

    async('transport_init', [dc, this.protocol], (initPayload: string) => {
      ws.send(hex(initPayload).buffer.buffer);

      log('ready', dc);

      if (dc === this.dc.default) {
        this.emit('connected');
      }

      if (this.pending[dc]) {
        for (let i = 0; i < this.pending[dc].length; i += 1) {
          const msg = this.pending[dc].shift();
          if (msg) this.send(msg);
        }
      }
    });
  };

  /**
   * Handles onclose event at websocket object
   */
  handleClose = (event: Event) => {
    if (!(event.currentTarget instanceof WebSocket)) return;

    const ws = event.currentTarget;
    const dc = (ws as WebSocketWithDC).__dc;

    log('closed', dc);

    if (dc === this.dc.default) {
      this.emit('disconnected');
    }
  };

  /**
   * Handles onmessage event at websocket object
   */
  handleMessage = (event: MessageEvent) => {
    if (!(event.currentTarget instanceof WebSocket)) return;

    const ws = event.currentTarget;
    const dc = (ws as WebSocketWithDC).__dc;

    if (event.data instanceof ArrayBuffer) {
      async('transport_decrypt', [dc, new Bytes(event.data).hex, this.auth.tempKey], (data: string[]) => {
        const [type, payload] = data;

        if (type === 'plain') {
          const msg = new PlainMessage(hex(payload));
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

        if (type === 'encrypted') {
          const msg = new Message(hex(payload));
          const result = this.tl.parse(msg.data);
          const headers = { msgID: msg.id, dcID: dc };

          this.rpc.processMessage(result, headers);
        }
      });
    }
  };

  /**
   * Method sends bytes to server via web socket.
   * @param {Message} msg Message interface
   */
  send(msg: PlainMessage | Message, headers: Record<string, any> = {}, cb?: ResponseCallback) {
    if (msg instanceof PlainMessage && cb) {
      this.plainResolvers[msg.nonce] = cb;
    }

    const dc = headers.dcID || this.dc.default;

    if (this.ws[dc] && this.ws[dc].readyState === 1) {
      const authKey = this.dc.getAuthKey(dc);

      async('transport_encrypt', [dc, msg.buf.hex, authKey ? authKey.key : ''], (data: string) => {
        this.ws[dc].send(hex(data).buffer.buffer);
      });

      if (msg instanceof Message) this.rpc.subscribe(msg, headers, cb);
      return;
    }

    if (!this.pending[dc]) this.pending[dc] = [];
    if (!this.ws[dc]) this.connect(dc);

    this.pending[dc].push(msg);
  }
}
