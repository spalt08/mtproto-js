/* eslint-disable import/no-cycle */
import { SchemaProvider } from '../schema';
import { Bytes } from '../serialization';
import TLAbstract from './abstract';
import resolve from './resolve';

/** TLString is a param constructor view for message buffer */
export default class TLVector extends TLAbstract {
  /** TL Constructor number */
  static ConstructorNumber = 0x1cb5c415;

  /** Type language notation name */
  _: string = 'vector';

  /** Represents bare types */
  isBare: boolean = false;

  /** Schema provider */
  schema: SchemaProvider;

  /** Schema of array item */
  itemDeclaration: string;

  /** Array of type language constructor */
  items: Array<TLAbstract>;

  /**
   * Creates TLVector
   * @param {string} data Data to set
   * @constructs
   */
  constructor(itemPredicate: string, schema: SchemaProvider, data: any[] = [], isBare: boolean = false) {
    super();

    this.schema = schema;

    this.itemDeclaration = itemPredicate;
    this.items = [];

    if (this.itemDeclaration) {
      this._ = `Vector<${this.itemDeclaration}>`;
    }

    this.isBare = isBare;

    if (data) this.value = data;
  }

  /**
   * Creates TLAny for vector template predicate
   */
  createItem(data?: any): TLAbstract {
    if (this.itemDeclaration) {
      const itemHandler = resolve(this.itemDeclaration, this.schema);

      if (itemHandler) {
        if (data) itemHandler.value = data;
      }

      return itemHandler;
    }

    throw new Error('Type Language: Unable to create vector with unknown type');
  }

  /**
   * Method checks nested params for a values
   */
  hasValue(): boolean {
    return this.items.length > 0;
  }

  /**
   * Method reads part of buffer
   */
  read(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    this.items = [];

    // check bareness
    if (!this.isBare && buf.slice(offset, offset + 4).int32 !== TLVector.ConstructorNumber) this.isBare = true;

    let nextOffset = offset + (this.isBare ? 0 : 4);
    this._byteSize = this.isBare ? 4 : 8;

    const length = buf.slice(nextOffset, nextOffset + 4).int32;
    nextOffset += 4;

    // check for inner type
    if (!this.itemDeclaration && length > 0) {
      const innerID = buf.slice(nextOffset, nextOffset + 4).int32;
      const declaration = this.schema.find(innerID);
      if (declaration && declaration.id) {
        this.itemDeclaration = declaration.predicate || declaration.method || '';
        this._ = `Vector<${this.itemDeclaration}>`;
      }
    }

    // read children
    for (let i = 0; i < length; i += 1) {
      const item = this.createItem();

      if (item) {
        nextOffset = item.read(buf, nextOffset);
        this._byteSize += item.byteSize;
        this.items.push(item);
      }
    }

    this.buf = buf.slice(offset, offset + this._byteSize);

    return nextOffset;
  }

  /**
   * Method writes part of buffer
   */
  write(buf: Bytes, offset: number = 0): number {
    if (this.buf) throw new Error('Buffer already allocated');

    this.buf = buf.slice(offset, offset + this.byteSize);

    let nextOffset = 0;

    // write constructor id
    if (!this.isBare) {
      this.buf.slice(0, 4).int32 = TLVector.ConstructorNumber;
      nextOffset += 4;
    }

    // write length
    this.buf.slice(nextOffset, nextOffset + 4).int32 = this.items.length;
    nextOffset = offset + nextOffset + 4;

    for (let i = 0; i < this.items.length; i += 1) {
      nextOffset = this.items[i].write(buf, nextOffset);
    }

    return nextOffset;
  }

  /**
   * Method fills array
   * @returns {any[]} Stored array
   */
  set value(data: any[]) {
    if (this.itemDeclaration && data) {
      this.items = [];

      for (let i = 0; i < data.length; i += 1) {
        const item = this.createItem(data[i]);
        if (item) this.items.push(item);
      }
    }
  }

  /**
   * Method gets array
   */
  get value(): any[] {
    return this.items.map((item) => item.value);
  }

  /**
   * Gets byte size
   */
  get byteSize(): number {
    this._byteSize = this.isBare ? 4 : 8;

    for (let i = 0; i < this.items.length; i += 1) {
      this._byteSize = this.items[i].byteSize;
    }

    return this._byteSize;
  }

  /**
   * Sets byte size
   */
  set byteSize(size: number) {
    this._byteSize = size;
  }
}
