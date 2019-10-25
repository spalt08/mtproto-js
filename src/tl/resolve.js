/* eslint-disable import/no-cycle */
// @flow

import type { TLAny } from '../interfaces';

import { SchemaProvider } from '../schemas';
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
export default function resolve(predicate: string, schema: SchemaProvider): TLAny {
  const vExpr = /vector<(.+?)>/i;
  const flExpr = /^flags.(\d+)\?(.+)$/i;

  let type = predicate;
  let flagIndex = 0;
  let isOptional = false;
  let isBare = false;
  let result = new TLAbstract();

  if (flExpr.test(predicate)) {
    isOptional = true;
    // $FlowFixMe
    [, flagIndex, type] = predicate.match(flExpr);
  }

  if (type[0] === '%') {
    isBare = true;
    type = type.slice(1);
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
    // $FlowFixMe
    const [, innerType] = type.match(vExpr);
    result = new TLVector(innerType, schema);

  // constructor
  } else {
    result = new TLConstructor(type, schema);
  }

  result.isOptional = isOptional;
  result.flagIndex = parseInt(flagIndex, 10);
  result.isBare = isBare;

  return result;
}
