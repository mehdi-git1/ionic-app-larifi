import { ProfessionalInterviewModel } from './../../models/professional-interview/professional-interview.model';
import { Injectable } from '@angular/core';


@Injectable()
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
