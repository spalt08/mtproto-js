/* eslint-disable import/no-cycle */
import { SchemaProvider } from '../schema';
import TLNumber from './number';
import TLBytes from './bytes';
import TLBoolean from './boolean';
import TLConstructor from './constructor';
import TLVector from './vector';
import TLAbstract from './abstract';

/**
 * Resolves type language handler by it's notation
 * @param {string} predicate Type languange notation
 */
export default function resolve(predicate: string, schema: SchemaProvider): TLAbstract {
  const vExpr = /vector<(.+?)>/i;
  const flExpr = /^flags.(\d+)\?(.+)$/i;

  let type = predicate;
  let flagIndex = 0;
  let isOptional = false;
  let isBare = false;
  let result = new TLAbstract();

  if (flExpr.test(predicate)) {
    const matches = predicate.match(flExpr) as string[];
    isOptional = true;
    flagIndex = parseInt(matches[1], 10);
    [,, type] = matches;
  }

  if (type[0] === '%') {
    isBare = true;
  }

  // number
  if (TLNumber.ValidTypes.indexOf(type) !== -1) {
    result = new TLNumber(type);

  // bytes
  } else if (TLBytes.ValidTypes.indexOf(type) !== -1) {
    result = new TLBytes(type);

  // boolean
  } else if (TLBoolean.ValidTypes.indexOf(type) !== -1) {
    result = new TLBoolean(type);

  // query
  } else if (type === '!X') {
    result = new TLConstructor(type, schema);

  // vector t
  } else if (type === 'vector') {
    result = new TLVector('', schema);

  // vector<any>
  } else if (vExpr.test(type)) {
    const [, innerType] = type.match(vExpr) as string[];
    result = new TLVector(innerType, schema);

  // constructor
  } else {
    result = new TLConstructor(type, schema);
  }

  result.isOptional = isOptional;
  result.isBare = isBare;
  result.flagIndex = flagIndex;

  return result;
}
