// @flow

import { Hex } from '../serialization';

/**
 * Service class for storing session data
 */
export default class SessionService {
  /** Type Language Handler */
  tl: TypeLanguage;

  /** Tranport handler */
  transport: Transport;

  /** Authorization data */
  session: {
    id: Hex,
    salt: Hex,
    sequenceNumber: number
  };

  /**
   * Creates session service object
   * @param {transport} transport Transport Handler
   * @param {TypeLanguage} tl Type Language Handler
   * @constructs
   */
  constructor(transport: Transport, tl: TypeLanguage) {
    this.tl = tl;
    this.transport = transport;
    this.session = {
      sequenceNumber: 1,
    };
  }

  setSession(id: string) {
    this.session.id = new Hex(id);
  }

  setServerSalt(salt: string) {
    this.session.salt = new Hex(salt);
  }

  setSequenceNumber(num: number) {
    this.session.sequenceNumber = num;
  }

  incrementSequence() {
    this.session.sequenceNumber += 1;
  }

  getSequenceNumber(): number {
    return this.session.sequenceNumber;
  }

  getSessionID() {
    return this.session.id || Hex.random(8);
  }

  getServerSalt() {
    return this.session.salt || Hex.random(8);
  }

  async initConnection() {
    const query = this.tl.query('invokeWithLayer', {
      layer: 105,
      query: this.tl.construct('initConnection', {
        api_id: 1037552,
        device_model: 'Macbook Pro 2016',
        system_version: 'Mojave 10.14.3 Beta',
        app_version: '0.0.1',
        system_lang_code: 'ru',
        lang_pack: 'ru',
        lang_code: 'ru',
      }),
    });

    this.transport.call(query);
  }
}
