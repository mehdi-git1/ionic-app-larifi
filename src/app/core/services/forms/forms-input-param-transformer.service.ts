import { FormsInputParamsModel } from './../../models/forms-input-params.model';
import { Injectable } from '@angular/core';

@Injectable()
export class FormsInputParamTransformerService {

  constructor() {
  }

  /**
   * Transforme le paramétre en entrée en tableau de FormsInputParamsModel
   * @param array : Données  à transformer en FormsInputParamsModel[]
   */
  toArrayFormsInputParams(array: FormsInputParamsModel[]) {
    const newArray: FormsInputParamsModel[] = [];
    for (const object of array) {
      newArray.push(this.toFormsInputParams(object));
    }
    return newArray;
  }

  /**
   * Transforme le paramétre en entrée en objet de type FormsInputParamsModel
   * @param object : Données à transformer en FormsInputParamsModel
   */
  toFormsInputParams(object: FormsInputParamsModel): FormsInputParamsModel {
    return !object ?
      object :
      new FormsInputParamsModel().fromJSON(object);
  }
}
