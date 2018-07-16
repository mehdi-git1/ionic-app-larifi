import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';

@Injectable()
export class PncTransformerProvider {

  constructor() {
  }

  toPncs(array: Pnc[]) {
    const newArray: Pnc[] = [];
    for (const object of array) {
      newArray.push(this.toPnc(object));
    }
    return newArray;
  }

  toPnc(object: Pnc): Pnc {
    return !object ?
      object :
      new Pnc().fromJSON(object);
  }
}
