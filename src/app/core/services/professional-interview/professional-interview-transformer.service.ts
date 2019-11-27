import { Injectable } from '@angular/core';

import {
    ProfessionalInterviewModel
} from '../../models/professional-interview/professional-interview.model';

@Injectable({ providedIn: 'root' })
export class ProfessionalInterviewTransformerService {

  constructor() {
  }

  toProfessionalInterviews(array: ProfessionalInterviewModel[]) {
    const newArray: ProfessionalInterviewModel[] = [];
    for (const object of array) {
      newArray.push(this.toProfessionalInterview(object));
    }
    return newArray;
  }

  toProfessionalInterview(object: ProfessionalInterviewModel): ProfessionalInterviewModel {
    return !object ?
      object :
      new ProfessionalInterviewModel().fromJSON(object);
  }

}
