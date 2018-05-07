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
    // Pour une creation ou un brouillon, on n'a le droit que de sauvegarder en brouillon
    if (careerObjective.careerObjectiveStatus === undefined || careerObjective.careerObjectiveStatus === CareerObjectiveStatus.DRAFT) {
      if(careerObjective.creationAuthor.speciality === Speciality.CAD){
        return [CareerObjectiveStatus.DRAFT,CareerObjectiveStatus.REGISTER].indexOf(newStatus) > -1;
      }
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatus.DRAFT].indexOf(newStatus) > -1;
    }
    return false;
  }

}
