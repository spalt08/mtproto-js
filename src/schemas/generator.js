// @flow

import parse from './parser';
import type { Schema } from './types';

/**
 * Func will parse all TL expessions from TL program into schema
 * @param {string} source TL query expression
 * @returns {Schema}
 */
export default function generateSchema(source: string): Schema {
  const schema = { constructors: [] };

  // eslint-disable-next-line no-restricted-syntax
  for (const line of source.split('\n')) {
    const schemaEntity = parse(line.trim());

    if (schemaEntity) schema.constructors.push(schemaEntity);
  }

  return schema;
}
