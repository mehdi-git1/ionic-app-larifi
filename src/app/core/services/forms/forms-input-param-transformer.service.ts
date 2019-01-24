import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FormsInputParamTransformerService {

  constructor() {
  }

  toArrayFormsInputParams(array: FormsInputParamsModel[]) {
    const newArray: FormsInputParamsModel[] = [];
    for (const object of array) {
      newArray.push(this.toFormsInputParams(object));
    }
    return newArray;
  }

  toFormsInputParams(object: FormsInputParamsModel): FormsInputParamsModel {
    return !object ?
      object :
      new FormsInputParamsModel().fromJSON(object);
  }
}
