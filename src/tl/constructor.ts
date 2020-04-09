/* eslint-disable import/no-cycle */
import { SchemaEntity, SchemaProvider } from '../schema';
import { Reader32, Writer32 } from '../serialization';
import TLAbstract from './abstract';
import TLFlags from './flags';
import resolve from './resolve';

/** Any type langauge Constructor */
export default class TLConstructor extends TLAbstract {
  /** Schortcut for this.declaration.predicate || this.declaration.method */
  _: string = '';

  /* Flag is bare type */
  isBare: boolean = false;

  /* Schema Entity for mapping props */
  declaration?: SchemaEntity;

  /** Schema provider */
  schema: SchemaProvider;

  /** Flag handler */
  flags: TLFlags | null = null;

  /* Params is a map of type language handlers  */
  params: Record<string, TLAbstract> = {};

  /**
   * Creates type language constructor
   */
  constructor(query: string | number, schema: SchemaProvider, isBare: boolean = false, data: Record<string, any> = {}) {
    super();

    this.schema = schema;
    this.isBare = isBare;

    if (query && schema) {
      this.fetch(schema.find(query));
    }

    if (data) {
      this.value = data;
    }
  }

  /**
   * Fetches type language schema
   */
  fetch(declaration?: SchemaEntity) {
    this.declaration = declaration;
    this._ = declaration ? (declaration.predicate || declaration.method || '') : '';
    this.params = {};
    this.flags = null;

    if (this.declaration && this.declaration.params) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];

        if (param.name === 'flags' && param.type === '#') {
          this.flags = new TLFlags();
        } else {
          this.params[param.name] = resolve(param.type, this.schema);
        }
      }
    }
  }

  /**
   * Method checks nested params for a values
   */
  hasValue(): boolean {
    if (this.declaration && this.declaration.params) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const paramHandler = this.params[this.declaration.params[i].name];
        if (paramHandler) {
          if (paramHandler.hasValue()) return true;
        }
      }
    }

    return false;
  }

  /**
   * Method reads part of buffer
   */
  read(reader: Reader32) {
    // read constructor id
    if (!this.isBare) {
      const cID = reader.int32();
      this.fetch(this.schema.find(cID));
    }
    // read flags
    if (this.flags != null) {
      this.flags.read(reader);
    }

    // read params
    if (this.declaration) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        const paramHandler = this.params[param.name];

        if (!paramHandler) continue;

        // flags#?true
        if (paramHandler.isOptional && paramHandler._ === 'true') {
          if (this.flags !== null && this.flags.has(paramHandler.flagIndex)) {
            paramHandler.value = true;
          }
          continue;
        }

        // other params
        if (!paramHandler.isOptional || (this.flags !== null && this.flags.has(paramHandler.flagIndex))) {
          paramHandler.read(reader);
        }
      }
    }
  }

  /**
   * Method writes part of buffer
   */
  write(writer: Writer32) {
    // write constructor id
    if (!this.isBare && this.declaration) {
      writer.int32(this.declaration.int32);
    }

    // write flags
    if (this.flags !== null) {
      this.flags.write(writer);
    }

    // write params
    if (this.declaration) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        const paramHandler = this.params[param.name];

        if (!paramHandler) continue;

        if (paramHandler.isOptional && paramHandler._ === 'true') {
          if (this.flags !== null) this.flags.set(paramHandler.flagIndex);
          continue;
        }

        if (!paramHandler.isOptional || paramHandler.hasValue()) {
          paramHandler.write(writer);
          if (this.flags !== null) this.flags.set(paramHandler.flagIndex);
        }
      }
    }
  }

  /**
   * Sets value
   */
  set value(data: Record<string, any>) {
    if (!data) return;

    if (data._) this.fetch(this.schema.find(data._));

    if (this.declaration) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        let paramHandler = this.params[param.name];

        if (!paramHandler) continue;

        if (paramHandler instanceof TLConstructor && data[param.name] instanceof TLConstructor) {
          this.params[param.name] = data[param.name];
          paramHandler = data[param.name];
          continue;
        } else {
          paramHandler.value = data[param.name];
        }

        if (paramHandler.isOptional && this.flags !== null && paramHandler.hasValue()) this.flags.set(paramHandler.flagIndex);
      }
    }
  }

  /**
   * Method gets object from paramsx
   */
  get value(): Record<string, any> {
    const output = {} as Record<string, any>;

    if (this.declaration) {
      output._ = this._;

      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        if (this.params[param.name]) {
          // skip optional constructors
          if (this.params[param.name] instanceof TLConstructor && this.params[param.name].isOptional && !this.params[param.name].hasValue()) {
            continue;
          }

          output[param.name] = this.params[param.name].value;
        }
      }
    }

    return output;
  }

  /**
   * Method calculates byte size of constructor
   * @returns {number} Constructor byte size
   */
  get byteSize(): number {
    this._byteSize = this.isBare ? 0 : 4;

    if (this.flags) this._byteSize += this.flags.byteSize;

    if (this.declaration) {
      for (let i = 0; i < this.declaration.params.length; i += 1) {
        const param = this.declaration.params[i];
        const paramHandler = this.params[param.name];

        if (!paramHandler) continue;

        if (!paramHandler.isOptional || paramHandler.hasValue() || (this.flags && this.flags.has(paramHandler.flagIndex))) {
          this._byteSize += paramHandler.byteSize;
        }
      }
    }

    return this._byteSize;
  }

  /**
   * Method sets byte size
   */
  set byteSize(size: number) {
    this._byteSize = size;
  }

  /**
   * Method creates new buffer and writes data to it
   */
  serialize(): Uint32Array {
    const writer = new Writer32(new Uint32Array(Math.ceil(this.byteSize / 4)));
    this.write(writer);

    return writer.buf;
  }

  /**
   * Shortcut for getting value
   * @returns {any} Json Object
   */
  json(): any {
    if (this.declaration && this.declaration.predicate === 'boolTrue') return true;
    if (this.declaration && this.declaration.predicate === 'boolFalse') return false;

    return this.value;
  }
}
