// @flow

export { default as parse } from './parser';
export { default as generateSchema } from './generator';
export { default as SchemaProvider } from './provider';
export type { Schema, SchemaEntity } from './types';

// Ref: https://core.telegram.org/schema/mtproto
export { default as MTProto } from './predefined/mtproto.json';

// Ref: https://core.telegram.org/schema
export { default as Layer105 } from './predefined/layer105.json';
