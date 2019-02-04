import { Injectable } from '@angular/core';

import { EObservationModel } from '../../models/eobservation.model';


@Injectable()
export class EObservationTransformerService {

  constructor() {
  }

  /**
 * Transforme le paramètre en entrée en tableau de EObservationModel
 * @param eObservationModelArray : Données  à transformer en EObservationModel[]
 * @return l'objet EObservationModel[] transformé
 */
  toEObservations(eObservationModelArray: EObservationModel[]): EObservationModel[] {
    const newArray: EObservationModel[] = [];
    for (const object of eObservationModelArray) {
      newArray.push(this.toEObservation(object));
    }
    return newArray;
  }

  /**
 * Transforme le paramètre en entrée en objet de type EObservationModel
 * @param eObservationModel : Données à transformer en EObservationModel
 * @return l'objet EObservationModel transformé
 */
  toEObservation(eObservationModel: EObservationModel): EObservationModel {
    return !eObservationModel ?
      eObservationModel :
      new EObservationModel().fromJSON(eObservationModel);
  }

}
