import { CareerObjectiveModel } from '../../models/career-objective.model';
import { Injectable } from '@angular/core';


@Injectable()
export class CareerObjectiveTransformerService {

  constructor() {
  }

  toCareerObjectives(array: CareerObjectiveModel[]) {
    const newArray: CareerObjectiveModel[] = [];
    for (const object of array) {
      newArray.push(this.toCareerObjective(object));
    }
    return newArray;
  }

  toCareerObjective(object: CareerObjectiveModel): CareerObjectiveModel {
    return !object ?
      object :
      new CareerObjectiveModel().fromJSON(object);
  }

}
