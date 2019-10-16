/* eslint-disable import/no-cycle */
// @flow

import type { TLAny } from '../interfaces';
import type { SchemaEntity } from '../schemas';

import { SchemaProvider } from '../schemas';
import { GenericView, GenericBuffer } from '../serialization';
import TLAbstract from './abstract';
import resolve from './resolve';

/** TLString is a param constructor view for message buffer */
export default class TLVector extends TLAbstract implements TLAny {
  /** TL Constructor number */
  static ConstructorNumber = 0x1cb5c415;

  /** Schema provider */
  schema: SchemaProvider

  /** Schema of array item */
  itemDeclaration: ?SchemaEntity;

  /** Count of array items */
  itemsLength: number = 0;

  /** Array of type language constructor */
  items: Array<TLAny>;

  /** Byte offset of items data */
  byteDataOffset: number = 5;

  /**
   * Creates TLVector
   * @param {string} data Data to set
   * @constructs
   */
  constructor(itemPredicate: string, schema: SchemaProvider, data?: any[] = [], isBare?: boolean = false) {
    super();

    this.schema = schema;

    this.itemDeclaration = schema.find(itemPredicate);
    this.items = [];
    this.itemsLength = 0;

    if (isBare) {
      this.byteDataOffset = 4;
    } else {
      this.byteDataOffset = 8;
    }

    this.byteSize = this.byteDataOffset;
    this.value = data;
  }

  /**
   * Method sets array
   * @returns {any[]} Stored array
   */
  set value(data: any[]) {
    if (this.itemDeclaration && (this.itemDeclaration.predicate || this.itemDeclaration.method)) {
      this.byteSize = this.byteDataOffset;
      this.items = [];
      this.itemsLength = 0;

      for (let i = 0; i < data.length; i += 1) {
        const itemHandler = this.createItem(data[i]);

        if (itemHandler) {
          this.byteSize += itemHandler.byteSize;
          this.items.push(itemHandler);
          this.itemsLength += 1;
        }
      }
    }
  }

  /**
   * Method gets array
   * @returns {any[]} Array
   */
  get value(): any[] {
    const output = [];

    for (let i = 0; i < this.itemsLength; i += 1) {
      output.push(this.items[i].value);
    }

    return output;
  }

  /**
   * Creates TLAny for vector template predicate
   * @param {string} data Data to set
   * @returns {TLAny}
   */
  createItem(data?: any): TLAny {
    if (this.itemDeclaration) {
      const itemHandler = resolve(this.itemDeclaration.predicate || this.itemDeclaration.method || '', this.schema);

      if (itemHandler) {
        if (data) itemHandler.value = data;
      }

      return itemHandler;
    }

    throw new Error('Type Language: Unable to create vector with unknown type');
  }


  /**
   * Method maps part of buffer
   * @param {GenericBuffer} buf Buffer for mapping
   * @param {number} offset Byte offset for mapping buffer
   * @returns {number} Byte offset after mapping
   */
  map(buf: GenericBuffer, offset?: number = 0): number {
    let nextOffset = offset + this.byteDataOffset;

    if (this.itemsLength > 0) {
      this.view = new GenericView(buf, offset, this.byteSize);

      if (!this.isBare) {
        this.view.setNumber(TLVector.ConstructorNumber, 0, 4);
        this.view.setNumber(this.itemsLength, 4, 8);
      } else {
        this.view.setNumber(this.itemsLength, 0, 4);
      }

      for (let i = 0; i < this.itemsLength; i += 1) {
        nextOffset += this.items[i].map(buf, nextOffset);
      }
    } else {
      const lengthView = new GenericView(buf, offset, 8);

      if (!this.isBare) {
        const cID = lengthView.getNumber(0, 4);
        if (cID !== TLVector.ConstructorNumber) {
          this.isBare = true;
          this.byteDataOffset = 4;
        }
      }

      nextOffset = offset + this.byteDataOffset;

      this.itemsLength = this.isBare ? lengthView.getNumber(0, 4) : lengthView.getNumber(4, 4);

      for (let i = 0; i < this.itemsLength; i += 1) {
        const itemHandler = this.createItem();

        if (itemHandler) {
          nextOffset = itemHandler.map(buf, nextOffset);

          this.byteSize += itemHandler.byteSize;
          this.items.push(itemHandler);
        }
      }
    }

    return nextOffset;
  }
}
