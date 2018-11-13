import { Injectable } from '@angular/core';

import { WaypointStatus } from './../../models/waypointStatus';

@Injectable()
export class WaypointStatusProvider {

  constructor() { }

  /**
  * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
  * @param currentStatus Le statut d'origine.
  * @param newStatus Le statut cible.
  * @return Vrai si la transition est acceptée, false sinon.
  */
  isTransitionOk(currentStatus: WaypointStatus, newStatus: WaypointStatus): boolean {
    // Pour une creation ou un brouillon, on n'a le droit de sauvegarder en brouillon ou en statut enregistré
    if (currentStatus === undefined || currentStatus === WaypointStatus.DRAFT) {
      // Liste des nouveaux statuts authorisés
      return [WaypointStatus.DRAFT, WaypointStatus.REGISTERED].indexOf(newStatus) > -1;
    }
    /**
     * Pour un point d'étape en statut enregistré, on a le droit de:
     * l'enregistrer
    */
    if (currentStatus === WaypointStatus.REGISTERED) {
      // Liste des nouveaux statuts authorisés
      return [WaypointStatus.REGISTERED].indexOf(newStatus) > -1;
    }
    return false;
  }

}
