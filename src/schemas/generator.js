// @flow

import parse from './parser';
import type { Schema } from './types';

// Func will parse all TL expessions from TL program into schema
export default function generateScheme(source: string): Schema {
  const schema = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const line of source.split('\n')) {
    const schemaEntity = parse(line.trim());

    if (schemaEntity) schema.push(schemaEntity);
  }

  return schema;
}
