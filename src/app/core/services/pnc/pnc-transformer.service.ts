import { PncModel } from '../../models/pnc.model';
import { Injectable } from '@angular/core';

@Injectable()
export class PncTransformerService {

  constructor() {
  }

  toPncs(array: PncModel[]) {
    const newArray: PncModel[] = [];
    for (const object of array) {
      newArray.push(this.toPnc(object));
    }
    return newArray;
  }

  toPnc(object: PncModel): PncModel {
    return !object ?
      object :
      new PncModel().fromJSON(object);
  }
}
