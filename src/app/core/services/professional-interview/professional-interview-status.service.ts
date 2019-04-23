import { ProfessionalInterviewStateEnum } from './../../enums/professional-interview/professional-interview-state.enum';
import { CareerObjectiveStatusEnum } from '../../enums/career-objective-status.enum';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfessionalInterviewStatusService {

  constructor() {
  }

  /**
   * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
   * @param currentStatus Le statut d'origine.
   * @param newStatus Le statut cible.
   * @return Vrai si la transition est acceptée, false sinon.
   */
  isTransitionOk(currentStatus: ProfessionalInterviewStateEnum, newStatus: ProfessionalInterviewStateEnum): boolean {
    // Pour une creation ou un brouillon, on n'a le droit de sauvegarder en brouillon ou en statut enregistré
    if (currentStatus === undefined || currentStatus === null || currentStatus === ProfessionalInterviewStateEnum.DRAFT) {
      // Liste des nouveaux statuts authorisés
      return [ProfessionalInterviewStateEnum.DRAFT].indexOf(newStatus) > -1;
    }
    return false;
  }
}