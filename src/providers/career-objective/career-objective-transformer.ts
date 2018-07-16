import { CareerObjective } from './../../models/careerObjective';
import { Injectable } from '@angular/core';


@Injectable()
export class CareerObjectiveTransformerProvider {

  constructor() {
  }

  toCareerObjectives(array: CareerObjective[]) {
    const newArray: CareerObjective[] = [];
    for (const object of array) {
      newArray.push(this.toCareerObjective(object));
    }
    return newArray;
  }

  toCareerObjective(object: CareerObjective): CareerObjective {
    return !object ?
      object :
      new CareerObjective(object);
  }

}
