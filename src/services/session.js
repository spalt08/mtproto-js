// @flow

import type { Transport, DataStorage } from '../interfaces';

import TypeLanguage from '../typeLanguage';
import { Hex } from '../serialization';
import { logs } from '../utils/log';

const log = logs('session');

/**
 * Service class for storing session data
 * @param {sessionID} Hex Session identificator
 * @param {serverSalt} Hex Server salt
 * @param {msgSeqNum} number Message sequence number
 */
export default class SessionService {
  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /** Storage handler */
  storage: DataStorage;

  /** Authorization data */
  session: {
    sid: ?Hex,
    expires: ?number,
    salt: ?Hex,
    seqNum: number,
    inited: boolean,
  };

  /**
   * Creates session service object
   * @param {transport} transport Transport Handler
   * @param {TypeLanguage} tl Type Language Handler
   * @constructs
   */
  constructor(transport: Transport, tl: TypeLanguage, storage: DataStorage) {
    this.tl = tl;
    this.transport = transport;
    this.storage = storage;

    const sessionID = storage.load('session', 'sessionID');
    const serverSalt = storage.load('session', 'serverSalt');
    const messageSeqNum = storage.load('session', 'messageSeqNum');
    const expires = storage.load('session', 'sessionExpires');
    const inited = storage.load('session', 'sessionInited');

    this.session = {
      sid: sessionID ? new Hex(sessionID) : undefined,
      salt: serverSalt ? new Hex(serverSalt) : undefined,
      expires: expires ? parseInt(expires, 10) : undefined,
      seqNum: messageSeqNum ? parseInt(messageSeqNum, 10) : 0,
      inited: inited || false,
    };
  }

  /**
   * Gets session identificator
   * @returns {Hex} Session identificator
   */
  get sessionID(): Hex {
    if (!this.session.sid) throw new Error('Session service: Undefined session ID');
    return this.session.sid;
  }

  /**
   * Sets session identificator
   * @param {Hex} sid Session identificator
   */
  set sessionID(sid: Hex) {
    this.storage.save('session', 'sessionID', sid.toString());
    this.msgSeqNum = 0;
    this.isInited = false;
    this.session.sid = sid;
  }

  /**
   * Gets server salt
   * @returns {Hex} Server salt
   */
  get serverSalt(): Hex {
    if (!this.session.salt) this.session.salt = Hex.random(8);
    return this.session.salt;
  }

  /**
   * Sets session identificator
   * @param {Hex} sid Session identificator
   */
  set serverSalt(salt: Hex) {
    this.storage.save('session', 'serverSalt', salt.toString());
    this.session.salt = salt;
  }

  /**
   * Gets message sequence number
   * @returns {number} Message sequence number
   */
  get msgSeqNum(): number {
    return this.session.seqNum;
  }

  /**
   * Sets message sequence number
   * @param {number} seqNum Message sequence number
   */
  set msgSeqNum(seqNum: number) {
    this.storage.save('session', 'messageSeqNum', seqNum);
    this.session.seqNum = seqNum;
  }

  /**
   * Increments message sequence number
   * @param {boolean} isContentRelated If message is content related
   */
  nextSeqNum(isContentRelated?: boolean = true) {
    const isc = isContentRelated ? 1 : 0;
    const seqNo = this.session.seqNum;
    this.msgSeqNum += isc;

    return seqNo * 2 + isc;
  }

  /**
   * Gets message sequence number
   * @returns {number} Message sequence number
   */
  get expires(): number {
    if (!this.session.expires) throw new Error('Session service: Undefined session expire timestamp');
    return this.session.expires;
  }

  /**
   * Sets message sequence number
   * @param {number} exp Message sequence number
   */
  set expires(exp: number) {
    this.storage.save('session', 'sessionExpires', exp);
    this.session.expires = exp;
  }

  /**
   * Gets session initialization flag
   * @returns {boolean} Initialization flag
   */
  get isInited(): boolean {
    return this.session.inited;
  }

  /**
   * Sets session initialization flag
   * @param {boolean} value Initialization flag
   */
  set isInited(value: boolean) {
    this.storage.save('session', 'sessionInited', value);
    this.session.inited = value;
  }

  async prepare() {
    if (!this.isInited) {
      log('initing new session');
      await this.initConnection();
    } else {
      log('loaded from storage');
    }
  }

  async initConnection() {
    const query = this.tl.construct('help.getNearestDc');
    console.log(query);
    const connectionWrapper = this.tl.construct('initConnection', {
      api_id: 1037552,
      device_model: 'Macbook Pro 2016',
      system_version: 'Mojave 10.14.3 Beta',
      app_version: '0.0.1',
      system_lang_code: 'ru',
      lang_pack: '',
      lang_code: 'ru',
      query,
    });
    console.log(connectionWrapper);
    const invokeWrapper = this.tl.query('invokeWithLayer', {
      layer: this.transport.APILayer,
      query: connectionWrapper,
    });
    console.log(invokeWrapper);

    const [res] = await this.transport.call(invokeWrapper);

    console.log('nearest dc:', res.json());

    if (res.declaration.predicate === 'nearestDc') {
      this.isInited = true;
      log('session successfuly inited');
    }
  }
}
