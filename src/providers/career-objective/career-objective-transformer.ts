import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';


@Injectable()
export class CareerObjectiveTransformerProvider {

  constructor() {
  }

  toCareerObjectives(careerObjectiveArray: CareerObjective[]) {
    const newArray: CareerObjective[] = [];
    for (const careerObjective of careerObjectiveArray) {
      newArray.push(this.toCareerObjective(careerObjective));
    }
    return newArray;
  }

  toCareerObjective(careerObjectiveObject: CareerObjective): CareerObjective {
    return new CareerObjective().fromJSON(careerObjectiveObject);
  }

}
