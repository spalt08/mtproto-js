// eslint-disable-next-line
import { Client } from '../client';
import { TLConstructor, TLVector } from '../tl';
import { logs } from '../utils/log';

const log = logs('updates');

/**
 * Service class for handling update messages
 */
export default class UpdatesService {
  /** Type Language Handler */
  client: Client;

  /** Subscribers */
  subscribers: Record<string, Array<(res: TLConstructor) => any>>;

  /**
   * Creates auth service object
   */
  constructor(client: Client) {
    this.client = client;
    this.subscribers = {};
  }

  /** Fetches update state */
  fetch() {
    this.client.call('updates.getState', {});
  }

  /**
   * Calls specific callback on update
   */
  emit(update: TLConstructor) {
    const listeners = this.subscribers[update._];
    if (listeners) {
      for (let i = 0; i < listeners.length; i += 1) listeners[i](update);
    }
  }

  /**
   * Subscribes specific callback on update
   */
  on(predicate: string, cb: (res: TLConstructor) => any) {
    if (!this.subscribers[predicate]) this.subscribers[predicate] = [];
    this.subscribers[predicate].push(cb);
  }

  /**
   * Processes update messages
   * Ref: https://core.telegram.org/api/updates
   */
  process(updateMsg: TLConstructor) {
    switch (updateMsg._) {
      case 'updateShort':
        log(updateMsg.params.update._);
        this.emit(updateMsg.params.update as TLConstructor);
        break;

      case 'updates':
        if (updateMsg.params.updates instanceof TLVector) {
          const updates = updateMsg.params.updates.items;
          for (let i = 0; i < updates.length; i += 1) {
            log(updates[i]._);
            this.emit(updates[i] as TLConstructor);
          }
        }
        break;

      case 'updatesCombined':
        if (updateMsg.params.updates instanceof TLVector) {
          const updates = updateMsg.params.updates.items;
          for (let i = 0; i < updates.length; i += 1) {
            log(updates[i]._);
            this.emit(updates[i] as TLConstructor);
          }
        }
        break;

      case 'updateShortMessage':
        this.emit(updateMsg);
        break;

      case 'updateShortChatMessage':
        this.emit(updateMsg);
        break;

      default:
        log('unknown', updateMsg._, updateMsg.json());
    }
  }
}
