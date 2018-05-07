import { Speciality } from './../../models/speciality';
import { CareerObjectiveStatus } from './../../models/careerObjectiveStatus';
import { Injectable } from '@angular/core';
import { CareerObjective } from '../../models/careerObjective';

@Injectable()
export class CareerObjectiveStatusProvider {

  constructor() {
  }

  /**
   * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
   * @param currentStatus Le statut d'origine.
   * @param newStatus Le statut cible.
   * @return Vrai si la transition est acceptée, false sinon.
   */
  isTransitionOk(speciality: Speciality, careerObjective: CareerObjective, newStatus: CareerObjectiveStatus): boolean {
    //Conversion en enum au cas où le paramètre serait en string
    currentStatus = CareerObjectiveStatus[currentStatus];

    // Pour une creation ou un brouillon, on n'a le droit que sauvegarder en brouillon
    if (currentStatus === undefined || currentStatus === CareerObjectiveStatus.DRAFT) {
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatus.DRAFT].indexOf(newStatus) > -1;
    }
    return false;
  }

}
