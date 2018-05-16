import { SecurityProvider } from './../security/security';
import { SessionService } from './../../services/session.service';
import { Storage } from '@ionic/storage';
import { CareerObjectiveStatus } from './../../models/careerObjectiveStatus';
import { Injectable } from '@angular/core';

@Injectable()
export class CareerObjectiveStatusProvider {

  constructor(private securityProvider: SecurityProvider,
    private sessionService: SessionService) {
  }

  /**
   * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
   * @param currentStatus Le statut d'origine.
   * @param newStatus Le statut cible.
   * @return Vrai si la transition est acceptée, false sinon.
   */
  isTransitionOk(currentStatus: CareerObjectiveStatus, newStatus: CareerObjectiveStatus): boolean {
    // Pour une creation ou un brouillon, on n'a le droit de sauvegarder en brouillon ou en statut enregistré
    if (currentStatus === undefined || currentStatus === CareerObjectiveStatus.DRAFT) {
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatus.DRAFT, CareerObjectiveStatus.REGISTERED].indexOf(newStatus) > -1;
    }
    /** 
     * Pour un objectif en statut enregistré, on a le droit de:
     * l'enregistrer, le valider ou l'abandonner
    */
    if (currentStatus === CareerObjectiveStatus.REGISTERED) {
      // Liste des nouveaux statuts authorisés
      return [CareerObjectiveStatus.REGISTERED, CareerObjectiveStatus.VALIDATED, CareerObjectiveStatus.ABANDONED].indexOf(newStatus) > -1;
    }
    return false;
  }

}
