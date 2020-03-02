/** SchemaEntity is a single json element of constructor or method */
export type SchemaEntity = {
  id: string,
  int32: number,
  predicate?: string,
  method?: string,
  type: string,

  params: Array<{
    name: string,
    type: string,
  }>,
};

/**
 * Type Language Schema
 * Ref: https://core.telegram.org/schema/json
 */
export type Schema = {
  constructors?: SchemaEntity[],
  methods?: SchemaEntity[],
};
