import { EObservationModel } from '../../models/e-observation.model';
import { Injectable } from '@angular/core';

@Injectable()
export class EObservationTransformerService {

  constructor() {
  }

  toEObservations(array: EObservationModel[]) {
    const newArray: EObservationModel[] = [];
    for (const object of array) {
      newArray.push(this.toEObservation(object));
    }
    return newArray;
  }

  toEObservation(object: EObservationModel): EObservationModel {
    return !object ?
      object :
      new EObservationModel().fromJSON(object);
  }
}
