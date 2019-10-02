// @flow

export type SchemaEntity = {
  id: number,
  predicate: string,
  result: string,
  type: 'system_type' | 'list' | 'constructor',

  properties?: Array<{
    name?: string,
    type: string,
    template?: string,
  }>,

  templates?: Array<{
    name: string,
    type: string,
  }>,

  listEntityType?: string,
  allocate: number,
};

export type Schema = Array<TLSchemaEntity>;
