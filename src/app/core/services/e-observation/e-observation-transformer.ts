import { EObservation } from '../../models/eObservation';
import { Injectable } from '@angular/core';

@Injectable()
export class EObservationTransformerProvider {

  constructor() {
  }

  toEObservations(array: EObservation[]) {
    const newArray: EObservation[] = [];
    for (const object of array) {
      newArray.push(this.toEObservation(object));
    }
    return newArray;
  }

  toEObservation(object: EObservation): EObservation {
    return !object ?
      object :
      new EObservation().fromJSON(object);
  }
}
