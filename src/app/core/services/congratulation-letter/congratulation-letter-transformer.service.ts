import { Injectable } from '@angular/core';

import { CongratulationLetterModel } from '../../models/congratulation-letter.model';

@Injectable({ providedIn: 'root' })
export class CongratulationLetterTransformerService {

  /**
   * Transforme un tableau d'objets en tableau de CongratulationLetterModel
   * @param object le tableau d'objet à transformer
   * @return un tableau d'objets de type CongratulationLetterModel
   */
  toCongratulationLetters(array: CongratulationLetterModel[]): CongratulationLetterModel[] {
    const newArray: CongratulationLetterModel[] = [];
    for (const object of array) {
      newArray.push(this.toCongratulationLetter(object));
    }
    return newArray;
  }

  /**
   * Transforme un objet en CongratulationLetterModel
   * @param object l'objet à transformer
   * @return un objet de type CongratulationLetterModel
   */
  toCongratulationLetter(object: CongratulationLetterModel): CongratulationLetterModel {
    return !object ?
      object :
      new CongratulationLetterModel().fromJSON(object);
  }

}
