import { Injectable } from '@angular/core';

import { WaypointStatusEnum } from '../../enums/waypoint.status.enum';

@Injectable({ providedIn: 'root' })
export class WaypointStatusService {

  constructor() { }

  /**
   * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
   * @param currentStatus Le statut d'origine.
   * @param newStatus Le statut cible.
   * @return Vrai si la transition est acceptée, false sinon.
   */
  isTransitionOk(currentStatus: WaypointStatusEnum, newStatus: WaypointStatusEnum): boolean {
    // Pour une creation ou un brouillon, on n'a le droit de sauvegarder en brouillon ou en statut enregistré
    if (currentStatus === undefined || currentStatus === WaypointStatusEnum.DRAFT) {
      // Liste des nouveaux statuts authorisés
      return [WaypointStatusEnum.DRAFT, WaypointStatusEnum.REGISTERED].indexOf(newStatus) > -1;
    }
    // Pour un point d'étape en statut enregistré, on a le droit de l'enregistrer
    if (currentStatus === WaypointStatusEnum.REGISTERED) {
      // Liste des nouveaux statuts authorisés
      return [WaypointStatusEnum.REGISTERED].indexOf(newStatus) > -1;
    }
    return false;
  }

}
