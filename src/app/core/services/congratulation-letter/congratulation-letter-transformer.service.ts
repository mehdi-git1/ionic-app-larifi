import { CongratulationLetterModel } from './../../models/congratulation-letter.model';
import { CareerObjectiveModel } from '../../models/career-objective.model';
import { Injectable } from '@angular/core';


@Injectable()
export class CongratulationLetterTransformerService {

  constructor() {
  }

  toCongratulationLetters(array: CongratulationLetterModel[]) {
    const newArray: CongratulationLetterModel[] = [];
    for (const object of array) {
      newArray.push(this.toCongratulationLetter(object));
    }
    return newArray;
  }

  toCongratulationLetter(object: CongratulationLetterModel): CongratulationLetterModel {
    return !object ?
      object :
      new CongratulationLetterModel().fromJSON(object);
  }

}
