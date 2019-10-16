/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
// @flow

import type { Schema } from '../schemas';
import { SchemaProvider } from '../schemas';
import { GenericView, GenericBuffer } from '../serialization';
import TLType from './type';
import TLNumber from './number';
import TLBytes from './bytes';
import TLBoolean from './boolean';
import TLConstructor from './constructor';
import TLEnum from './enum';

/** TLString is a param constructor view for message buffer */
export default class TLVector extends TLType {
  /** TL Constructor number */
  static ConstructorNumber = 0x1cb5c415;

  /** Schema provider */
  schema: SchemaProvider

  /** Schema of array item */
  itemDeclaration: Schema;

  /** Count of array items */
  itemsLength: number = 0;

  /** Array of TL entities */
  items: Array<TLType | TLNumber | TLBytes | TLVector | TLBoolean | TLConstructor>;

  /** Byte offset of items data */
  byteDataOffset: number = 5;

  /* Flag is bare type */
  isBare: boolean = false;

  /**
   * Creates TLString object from data
   * @param {string} data Data to set
   * @constructs
   */
  constructor(itemPredicate: string, schema: SchemaProvider, data?: any[] = [], isBare?: boolean = false) {
    super();

    this.schema = schema;

    this.itemDeclaration = schema.find(itemPredicate) || { predicate: itemPredicate };
    this.items = [];
    this.itemsLength = 0;

    if (isBare) {
      this.byteDataOffset = 4;
      this.byteSize = this.byteDataOffset;
    } else {
      this.byteDataOffset = 8;
      this.byteSize = this.byteDataOffset;
    }

    if (this.itemDeclaration.predicate) {
      for (let i = 0; i < data.length; i += 1) {
        const tlEntity = this.createItem(data[i]);

        if (tlEntity) {
          this.byteSize += tlEntity.byteSize;
          this.items.push(tlEntity);
          this.itemsLength += 1;
        }
      }
    }
  }

  /**
   * Creates TLType for vector template predicate
   * @param {string} data Data to set
   * @returns {TLType}
   */
  createItem(data?: any): TLType {
    let tlEntity;

    if (TLNumber.ValidTypes.indexOf(this.itemDeclaration.predicate) !== -1) {
      tlEntity = new TLNumber(this.itemDeclaration.predicate, data);
    } else if (TLBytes.ValidTypes.indexOf(this.itemDeclaration.predicate) !== -1) {
      tlEntity = new TLBytes(data);
    } else {
      const resultTypes = this.schema.findAll(this.itemDeclaration.predicate);

      if (resultTypes.length > 0) {
        tlEntity = new TLEnum(resultTypes, this.schema);
      } else {
        tlEntity = new TLConstructor(this.itemDeclaration.predicate, this.schema);
      }
    }

    return tlEntity;
  }

  /**
   * Creates view to Message Buffer to set and get values
   * @param {GenericBuffer} buf Message Buffer
   * @param {number} bufOffset Buffer Byte Offset
   */
  mapBuffer(buf: GenericBuffer, bufOffset?: number = 0) {
    let offset = bufOffset + this.byteDataOffset;

    if (this.itemsLength > 0) {
      this.view = new GenericView(buf, bufOffset, this.byteSize);

      if (!this.isBare) {
        this.view.setNumber(TLVector.ConstructorNumber, 0, 4);
        this.view.setNumber(this.itemsLength, 4, 8);
      } else {
        this.view.setNumber(this.itemsLength, 0, 4);
      }

      for (let i = 0; i < this.itemsLength; i += 1) {
        offset += this.items[i].mapBuffer(buf, offset);
      }
    } else {
      const lengthView = new GenericView(buf, bufOffset, 8);

      if (!this.isBare) {
        const cID = lengthView.getNumber(0, 4);
        if (cID !== TLVector.ConstructorNumber) {
          this.isBare = true;
          this.byteDataOffset = 4;
        }
      }

      offset = bufOffset + this.byteDataOffset;

      this.itemsLength = this.isBare ? lengthView.getNumber(0, 4) : lengthView.getNumber(4, 4);
  
      for (let i = 0; i < this.itemsLength; i += 1) {
        const tlEntity = this.createItem();

        if (tlEntity) {
          offset = tlEntity.mapBuffer(buf, offset);

          this.byteSize += tlEntity.byteSize;
          this.items.push(tlEntity);
        }
      }
    }

    return offset;
  }

  /**
   * Method gets array from items
   * @returns {any[]} Stored Value
   */
  getValue(): any[] {
    const output = [];

    for (let i = 0; i < this.itemsLength; i += 1) {
      output.push(this.items[i].getValue());
    }

    return output;
  }
}
