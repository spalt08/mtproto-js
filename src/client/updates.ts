import { TLConstructor, TLVector } from '../tl';
import { logs } from '../utils/log';
import { ClientInterface, RequestCallback } from './types';

// debug helper
const debug = (flag: any, ...rest: any[]) => {
  if (flag) logs('updates')(...rest);
};

export type UpdateListener = (update: any) => void;

/**
 * Service class for handling update messages
 */
export default class UpdateService {
  /** Type Language Handler */
  client?: ClientInterface;

  /** Subscribers */
  subscribers: Record<string, UpdateListener[]>;

  /**
   * Creates auth service object
   */
  constructor(client?: ClientInterface) {
    this.client = client;
    this.subscribers = {};
  }

  /** Fetches update state */
  fetch(cb?: RequestCallback) {
    if (!this.client) throw new Error('Unable to fetch updates without client instance');
    this.client.call('updates.getState', {}, cb);
  }

  /**
   * Calls specific callback on update
   */
  emit(update: TLConstructor) {
    const listeners = this.subscribers[update._];
    if (listeners) {
      for (let i = 0; i < listeners.length; i += 1) listeners[i](update.json());
    }

    debug(this.client, update._);
  }

  /**
   * Calls special update events like mentioned users, chats, vectors
   */
  emitSpecial(predicate: string, data: any) {
    const listeners = this.subscribers[predicate];
    if (listeners) {
      for (let i = 0; i < listeners.length; i += 1) listeners[i](data);
    }
  }

  /**
   * Subscribes specific callback on update
   */
  on(predicate: string, reciever: UpdateListener) {
    if (!this.subscribers[predicate]) this.subscribers[predicate] = [];
    this.subscribers[predicate].push(reciever);
  }

  /**
   * Processes update messages
   * Ref: https://core.telegram.org/api/updates
   */
  process(updateMsg: TLConstructor) {
    switch (updateMsg._) {
      // Ref: https://core.telegram.org/constructor/updateShort
      case 'updateShort':
        this.emit(updateMsg.params.update as TLConstructor);
        break;

      // Ref: https://core.telegram.org/type/Updates
      case 'updateShortMessage':
      case 'updateShortSentMessage':
      case 'updateShortChatMessage':
        this.emit(updateMsg);
        break;

      // Ref: https://core.telegram.org/constructor/updates
      case 'updatesCombined':
      case 'updates':
        // process users
        if (updateMsg.params.users instanceof TLVector) {
          const users = updateMsg.params.users.items;

          for (let i = 0; i < users.length; i += 1) {
            this.emitSpecial('user', users[i].json());
          }
        }

        // process chats
        if (updateMsg.params.chats instanceof TLVector) {
          const chats = updateMsg.params.chats.items;

          for (let i = 0; i < chats.length; i += 1) {
            this.emitSpecial('chat', chats[i].json());
          }
        }

        // process updates
        if (updateMsg.params.updates instanceof TLVector) {
          const updates = updateMsg.params.updates.items;

          for (let i = 0; i < updates.length; i += 1) {
            this.emit(updates[i] as TLConstructor);
          }
        }
        break;

        // todo: handle updatesTooLong
        // Ref: https://core.telegram.org/api/updates#recovering-gaps

      default:
        debug(this.client, 'unknown', updateMsg._, updateMsg.json());
    }
  }
}
