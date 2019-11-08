/* eslint-disable no-cond-assign */
import crc32 from '../utils/crc32';
import { SchemaEntity } from './types';

// Func will parse TL expession into schema object
export default function parse(formula: string): SchemaEntity {
  let p: number;

  const lPos = (p = formula.indexOf(';')) === -1 ? formula.length : p;
  const cPos = (p = formula.indexOf('//')) === -1 ? formula.length : p;
  const sPos = (p = formula.indexOf(' ')) === -1 ? formula.length : p;
  const iPos = (p = formula.indexOf('#')) === -1 ? formula.length : p;
  const ePos = formula.indexOf('=');

  if (cPos === 0) throw new Error(`Unable to parse: ${formula}`);

  const output: SchemaEntity = {
    id: iPos < sPos ? parseInt(formula.slice(iPos + 1, sPos), 16).toString() : crc32(formula).toString(),
    predicate: (iPos < sPos ? formula.slice(0, iPos) : formula.slice(0, sPos)),
    type: (ePos > -1 ? formula.slice(ePos + 2, lPos) : ''),
    params: [],
  };

  // todo: fix
  output.id = (new Int32Array([parseInt(output.id, 10)]))[0].toString(10);

  let pos = sPos + 1;

  while (pos < ePos && pos < lPos) {
    let nPos = formula.indexOf(' ', pos);
    if (nPos === -1) nPos = lPos;

    const char = formula.charAt(pos);

    // ?
    if (char === '?') {
      pos += 2;

    // #
    } else if (char === '#') {
      pos += 2;

    // {t:Type}
    } else if (char === '{') {
      pos = nPos + 2;

    // [ t ]
    } else if (char === '[') {
      pos = nPos + 2;

    // (Vector long)
    } else if (char === '(') {
      pos = nPos + 2;
    } else {
      const token = formula.slice(pos, nPos);

      // param:type
      if (token.indexOf(':') !== -1) {
        const dPos = formula.indexOf(':', pos);
        const name = formula.slice(pos, dPos);

        const type = formula.slice(dPos + 1, nPos).toLowerCase();

        output.params.push({
          name,
          type,
        });

        pos = nPos + 1;

      // just number
      } else if (/[0-9]+$/.test(token)) {
        pos = nPos + 1;

      // 4 * [ int ]
      } else {
        const dPos = (p = formula.indexOf(':')) === -1 ? ePos : p;
        nPos = formula.slice(0, dPos).lastIndexOf(' ');

        if (nPos === -1) nPos = ePos;

        pos = nPos + 1;
      }
    }
  }

  return output;
}
