// @flow

import type { Transport, DataStorage, TLAny } from '../interfaces';

import TypeLanguage from '../tl';
import { logs } from '../utils/log';
import TLVector from '../tl/vector';

const log = logs('updates');

/**
 * Service class for handling update messages
 */
export default class UpdatesService {
  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /** Storage handler */
  storage: DataStorage;

  /** Update State */
  state: {
    pts: number;
    qts: number;
    seq: number;
    date: number;
  }

  /** Subscribers */
  subscribers: { [string]: Array<(TLAny) => any> };

  /**
   * Creates auth service object
   * @param {Transport} transport Transport Handler
   * @param {TypeLanguage} tl Type Language Handler
   * @param {DataStorage} stroage Async storage
   */
  constructor(transport: Transport, tl: TypeLanguage, storage: DataStorage) {
    this.tl = tl;
    this.transport = transport;
    this.storage = storage;

    this.subscribers = {};

    this.state = {
      pts: 0,
      qts: 0,
      seq: 0,
      date: 0,
    };
  }

  /**
   * Gets update pts
   * @returns {number} PTS
   */
  get pts(): number {
    return this.state.pts;
  }

  /**
   * Sets update pts
   * @param {number} value PTS
   */
  set pts(value: number) {
    this.storage.save('updates', 'pts', value);
    this.state.pts = value;
  }

  /**
   * Gets update qts
   * @returns {number} QTS
   */
  get qts(): number {
    return this.state.pts;
  }

  /**
   * Sets update qts
   * @param {number} value QTS
   */
  set qts(value: number) {
    this.storage.save('updates', 'qts', value);
    this.state.qts = value;
  }

  /**
   * Gets update seq
   * @returns {number} Seq
   */
  get seq(): number {
    return this.state.seq;
  }

  /**
   * Sets update seq
   * @param {number} value Seq
   */
  set seq(value: number) {
    this.storage.save('updates', 'seq', value);
    this.state.seq = value;
  }

  /**
   * Gets update date
   * @returns {number} Date
   */
  get date(): number {
    return this.state.date;
  }

  /**
   * Sets update date
   * @param {number} value Date
   */
  set date(value: number) {
    this.storage.save('updates', 'date', value);
    this.state.date = value;
  }

  /** Fetches update state */
  async prepare() {
    await this.loadFromStorage();

    const remoteState = await this.transport.call('updates.getState');

    this.pts = remoteState.result.params.pts.value;
    this.qts = remoteState.result.params.qts.value;
    this.date = remoteState.result.params.date.value;
    this.seq = remoteState.result.params.seq.value;

    // const diff = await this.transport.call('updates.getDifference', {
    //   pts: this.pts,
    //   date: this.date,
    //   qts: this.qts,
    // });

    // console.log(diff);
  }

  /**
   * Loads session data from async storage
   */
  async loadFromStorage() {
    const pts = await this.storage.load('updates', 'pts');
    const qts = await this.storage.load('updates', 'qts');
    const seq = await this.storage.load('updates', 'seq');
    const date = await this.storage.load('updates', 'date');

    this.state = {
      pts: pts ? parseInt(pts, 10) : 0,
      qts: qts ? parseInt(qts, 10) : 0,
      seq: seq ? parseInt(seq, 10) : 0,
      date: date ? parseInt(date, 10) : 0,
    };
  }


  /**
   * Calls specific callback on update
   * @param {TLAny} update Update constructor
   */
  emit(update: TLAny) {
    const listeners = this.subscribers[update._];
    const { pts } = update.params;

    if (pts) {
      this.pts = pts.value;
    }

    if (listeners) {
      for (let i = 0; i < listeners.length; i += 1) listeners[i](update);
    }
  }

  /**
   * Subscribes specific callback on update
   * @param {TLAny} update Update constructor
   */
  on(predicate: string, cb: (TLAny) => any) {
    if (!this.subscribers[predicate]) this.subscribers[predicate] = [];
    this.subscribers[predicate].push(cb);
  }

  /**
   * Processes update messages
   * Ref: https://core.telegram.org/api/updates
   * @param {TLAny} updateMsg Updates type message
   */
  process(updateMsg: TLAny) {
    switch (updateMsg._) {
      case 'updateShort':
        this.date = updateMsg.params.date.value;
        this.emit(updateMsg.params.update);
        break;

      case 'updates':
        this.date = updateMsg.params.date.value;
        this.seq = updateMsg.params.seq.value;

        if (updateMsg.params.updates instanceof TLVector) {
          const updates = updateMsg.params.updates.items;
          for (let i = 0; i < updates.length; i += 1) this.emit(updates[i]);
        }
        break;

      case 'updatesCombined':
        this.date = updateMsg.params.date.value;
        this.seq = updateMsg.params.seq.value;

        if (updateMsg.params.updates instanceof TLVector) {
          const updates = updateMsg.params.updates.items;
          for (let i = 0; i < updates.length; i += 1) this.emit(updates[i]);
        }
        break;

      default:
        log('unknown', updateMsg._, updateMsg.json());
    }
  }
}
