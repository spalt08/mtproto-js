// @flow

import defaultSchema from './schema-default.json';
import TLConstructor from './constructor';

type TLSchemaConstructor = {
  id: number,
  predicate: string,
  type: string,
  params: Array<TLSchemaConstructor>,
};

type TLScema = {
  constructors: Array<TLSchemaConstructor>,
};

export default class TLSchemaAdapter {
  constructor(schema: TLScema) {
    this.schema = schema || defaultSchema;
  }

  find(predicate: string): TLSchemaConstructor {
    return this.schema.constructors.find((c) => c.predicate === predicate);
  }

  defineConstructor(formula: string) {
    const constr = new TLConstructor(formula);

    this.schema.constructors.push({
      id: constr.hex,
      predicate: constr.name,
      type: constr.name,
      params: [],
    });
  }
}
