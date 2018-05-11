import { SessionService } from './../../services/session.service';
import { Storage } from '@ionic/storage';
import { CareerObjectiveStatus } from './../../models/careerObjectiveStatus';
import { Injectable } from '@angular/core';

@Injectable()
export class CareerObjectiveStatusProvider {

  constructor(private sessionService: SessionService) {
  }

  /**
   * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
   * @param currentStatus Le statut d'origine.
   * @param newStatus Le statut cible.
   * @return Vrai si la transition est acceptée, false sinon.
   */
  isTransitionOk(currentStatus: CareerObjectiveStatus, newStatus: CareerObjectiveStatus): boolean {
    // Pour une creation ou un brouillon, on n'a le droit que  pour un pnc
    // pnc : il n'a le droit que de sauvegarder en brouillon
    // Carde : il a le droit de sauvegarder en brouillon ou en statut enregistrer
    if (currentStatus === undefined || currentStatus === CareerObjectiveStatus.DRAFT) {
      //   // Liste des nouveaux statuts authorisés
      if (this.sessionService.authenticatedUser.manager) {
        return [CareerObjectiveStatus.DRAFT].indexOf(newStatus) > -1 ||
          [CareerObjectiveStatus.REGISTER].indexOf(newStatus) > -1;
      }
      return [CareerObjectiveStatus.DRAFT].indexOf(newStatus) > -1;
    }
    // Pour un objectif en statut enregistrer, on a le droit que de le sauvegarder en statut enregistrer
    if (this.sessionService.authenticatedUser.manager && currentStatus === CareerObjectiveStatus.REGISTER) {
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatus.REGISTER].indexOf(newStatus) > -1;
    }
    return false;
  }

}
