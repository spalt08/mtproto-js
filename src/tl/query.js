// @flow

import TLConstructor from './constructor';
import TLSchemaAdapter from './schema';
import TLMessage from './message';

export default class TLQuery {
  /*
   * @prop TL Query Text
   * text: string
   *
   *
   * @prop TL Constructor
   * tlConstructor: TLConstructor
   */

  constructor(query: string, schema: TLSchemaAdapter) {
    this.text = query;
    this.tlConstructor = new TLConstructor(query, schema);
    this.message = new TLMessage(this.tlConstructor.getLength());
  }

  randomize(propName: string): TLQuery {
    const prop = this.tlConstructor.getProp(propName);
    const bytes = [];

    for (let i = 0; i < prop.length; i += 1) {
      bytes.push(Math.ceil(Math.random() * 255));
    }

    this.tlConstructor.setProp(propName, String.fromCharCode(...bytes));

    return this;
  }

  compose(): ArrayBuffer {
    let offset = 0;

    offset = this.message.fill(offset, 4, this.tlConstructor.hex);

    for (let i = 0; i < this.tlConstructor.properties.length; i += 1) {
      const prop = this.tlConstructor.properties[i];
      this.message.fill(offset, prop.length, prop.value);
    }

    return this.message.withHeaders();
  }
}
