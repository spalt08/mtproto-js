// @flow

import MTProto from './predefined/mtproto.json';
import Layer105 from './predefined/layer105.json';

export type { Schema, SchemaEntity } from './types';

export default {
  // Ref: https://core.telegram.org/schema/mtproto
  MTProto,
  // Ref: https://core.telegram.org/schema
  Layer105,
};

export { MTProto };
export { default as parse } from './parser';
export { default as generateSchema } from './generator';
export { default as SchemaProvider } from './provider';
