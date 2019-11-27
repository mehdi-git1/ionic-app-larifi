import { Injectable } from '@angular/core';

import { CareerObjectiveStatusEnum } from '../../enums/career-objective-status.enum';

@Injectable({ providedIn: 'root' })
export class CareerObjectiveStatusService {

  constructor() {
  }

  /**
   * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
   * @param currentStatus Le statut d'origine.
   * @param newStatus Le statut cible.
   * @return Vrai si la transition est acceptée, false sinon.
   */
  isTransitionOk(currentStatus: CareerObjectiveStatusEnum, newStatus: CareerObjectiveStatusEnum): boolean {
    // Pour une creation ou un brouillon, on n'a le droit de sauvegarder en brouillon ou en statut enregistré
    if (currentStatus === undefined || currentStatus === CareerObjectiveStatusEnum.DRAFT) {
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatusEnum.DRAFT, CareerObjectiveStatusEnum.REGISTERED].indexOf(newStatus) > -1;
    }
    /**
     * Pour un objectif en statut enregistré, on a le droit de:
     * l'enregistrer, le valider ou l'abandonner
    */
    if (currentStatus === CareerObjectiveStatusEnum.REGISTERED) {
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatusEnum.REGISTERED, CareerObjectiveStatusEnum.VALIDATED, CareerObjectiveStatusEnum.ABANDONED].indexOf(newStatus) > -1;
    }
    return false;
  }
}
