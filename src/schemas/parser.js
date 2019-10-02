/* eslint-disable no-cond-assign */
// @flow

import * as crc32 from '../utils/crc32';
import type { SchemaEntity } from './types';

const allocateMap = {
  int: 4,
  long: 8,
};

// Func will parse TL expession into schema object
export default function parse(formula: string): SchemaEntity | null {
  let p;

  const lPos = (p = formula.indexOf(';')) === -1 ? formula.length : p;
  const cPos = (p = formula.indexOf('//')) === -1 ? formula.length : p;
  const sPos = (p = formula.indexOf(' ')) === -1 ? formula.length : p;
  const iPos = (p = formula.indexOf('#')) === -1 ? formula.length : p;
  const ePos = formula.indexOf('=');

  if (cPos === 0) return null;

  const output = {
    id: iPos < sPos ? parseInt(formula.slice(iPos + 1, sPos), 16) : crc32.str(formula),
    predicate: (iPos < sPos ? formula.slice(0, iPos) : formula.slice(0, sPos)).toLowerCase(),
    result: (ePos > -1 ? formula.slice(ePos + 2, lPos) : '').toLowerCase(),
    type: '',
    templates: [],
    properties: [],
    listEntityType: '',
    allocate: null,
  };

  let pos = sPos + 1;

  while (pos < ePos && pos < lPos) {
    let nPos = formula.indexOf(' ', pos);
    if (nPos === -1) nPos = lPos;

    const char = formula.charAt(pos);

    // ?
    if (char === '?') {
      output.type = 'system_type';
      output.allocate = allocateMap[output.predicate] || null;
      pos += 2;

    // #
    } else if (char === '#') {
      output.type = 'list';
      pos += 2;

    // {t:Type}
    } else if (char === '{') {
      nPos = formula.indexOf('}', pos);
      const dPos = formula.indexOf(':', pos);

      output.templates.push({
        name: formula.slice(pos + 1, dPos),
        type: formula.slice(dPos + 1, nPos),
      });

      pos = nPos + 2;

    // [ t ]
    } else if (char === '[') {
      nPos = formula.indexOf(']', pos);

      output.type = 'list';
      output.listEntityType = formula.slice(pos + 1, nPos).trim();

      pos = nPos + 2;

    // (Vector long)
    } else if (char === '(') {
      nPos = formula.indexOf(')', pos);
      const tPos = formula.indexOf(' ');

      output.type = 'constructor';

      const type = formula.slice(pos, Math.min(tPos, nPos));
      const template = tPos < nPos ? formula.slice(tPos + 1, nPos) : null;

      output.properties.push({
        type,
        template,
      });

      pos = nPos + 2;
    } else {
      let token = formula.slice(pos, nPos);

      // param:type
      if (token.indexOf(':') !== -1) {
        const dPos = formula.indexOf(':', pos);
        const tPos = formula.indexOf('<');
        const name = formula.slice(pos, dPos);

        if (tPos !== -1 && tPos < nPos) {
          const template = formula.slice(tPos + 1, formula.indexOf('>'));
          const predicate = formula.slice(dPos + 1, tPos).toLowerCase();

          output.properties.push({
            name,
            predicate,
            template,
          });
        } else {
          const predicate = formula.slice(dPos + 1, nPos).toLowerCase();

          output.properties.push({
            name,
            predicate,
          });
        }

        output.type = 'constructor';

        pos = nPos + 1;

      // just number
      } else if (/[0-9]+$/.test(token)) {
        pos = nPos + 1;
        console.error('Unexpected Number (', token, ') at formula', formula);

      // 4 * [ int ]
      } else {
        const dPos = (p = formula.indexOf(':')) === -1 ? ePos : p;
        nPos = formula.slice(0, dPos).lastIndexOf(' ');

        if (nPos === -1) nPos = ePos;

        token = formula.slice(pos, nPos);

        pos = nPos + 1;

        const complexType = /([0-9])+\*\[ (\w+) \]/;

        if (complexType.test(token)) {
          const expr = token.match(complexType);
          output.type = 'system_type';
          output.allocate = parseInt(expr[1], 10) * allocateMap[expr[2]] || null;
        } else {
          console.error('Unexpected token (', token, ') at formula', formula);
        }
      }
    }
  }

  return output;
}
