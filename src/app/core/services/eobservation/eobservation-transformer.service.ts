import { Injectable } from '@angular/core';

import { EObservationModel } from '../../models/eobservation.model';


@Injectable()
export class EObservationTransformerService {

  constructor() {
  }

  /**
 * Transforme le paramétre en entrée en tableau de EObservationModel
 * @param array : Données  à transformer en EObservationModel[]
 */
  toEObservations(array: EObservationModel[]) {
    const newArray: EObservationModel[] = [];
    for (const object of array) {
      newArray.push(this.toEObservation(object));
    }
    return newArray;
  }

  /**
 * Transforme le paramétre en entrée en objet de type EObservationModel
 * @param object : Données à transformer en EObservationModel
 */
  toEObservation(object: EObservationModel): EObservationModel {
    return !object ?
      object :
      new EObservationModel().fromJSON(object);
  }

}
