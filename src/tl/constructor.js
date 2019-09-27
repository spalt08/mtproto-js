// @flow

import { CRC32 } from '../tools';
import TLSchemaAdapter from './schema';

const typeToLength = {
  int128: 16,
  int: 8,
};

export default class TLConstructor {
  /*
   * @prop TL Constructor Name
   * name: string
   *
   *
   * @prop TL Constructor Hex
   * hex: string
   *
   *
   * @prop TL Constructor Props
   * properties: Array<any>
   */

  constructor(formula: string, schema: TLSchemaAdapter) {
    const namePos = formula.indexOf(' ');
    const hexPos = formula.indexOf('#');
    const eqPos = formula.indexOf('=');

    if (hexPos > -1) {
      this.name = formula.slice(0, hexPos);
      this.hex = parseInt(formula.slice(hexPos + 1, namePos), 16);
    } else {
      this.name = formula.slice(0, namePos);
      this.hex = schema.find(this.name).hex || CRC32.String(formula);
    }

    this.parseProps(formula.slice(namePos + 1, eqPos > -1 ? eqPos - 1 : formula.length));
  }

  getProp(name: string) {
    return this.properties.find((p) => p.name === name);
  }

  setProp(name: string, value: string | number) {
    for (let i = 0; i < this.properties.length; i += 1) {
      if (this.properties[i].name === name) {
        this.properties[i].value = value;
        return;
      }
    }
  }

  getLength(): number {
    let len = 4;

    for (let i = 0; i < this.properties.length; i += 1) {
      len += this.properties[i].length;
    }

    return len;
  }

  parseProps(formula: string) {
    this.properties = [];
    let pos = 0;

    while (pos < formula.length) {
      let delPos = formula.indexOf(':', pos);
      const delNextPos = formula.indexOf(':', delPos + 1);
      let nextPos;

      if (delPos === -1) delPos = formula.length;
      if (delNextPos === -1) {
        nextPos = formula.length;
      } else {
        nextPos = formula.slice(0, delNextPos).lastIndexOf(' ');
      }

      if (nextPos === -1) nextPos = formula.length;

      const type = formula.slice(delPos + 1, nextPos);

      this.properties.push({
        type,
        name: formula.slice(pos, delPos),
        value: null,
        length: typeToLength[type],
      });

      pos = nextPos + 1;
    }
  }
}
