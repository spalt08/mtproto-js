// @flow

export parse from './parser';
export generateSchema from './generator';
export SchemaProvider from './provider';
export type { Schema, SchemaEntity } from './types';

// Ref: https://core.telegram.org/schema/mtproto
export MTProto from './predefined/mtproto.json';

// Ref: https://core.telegram.org/schema
export Layer105 from './predefined/layer105.json';
