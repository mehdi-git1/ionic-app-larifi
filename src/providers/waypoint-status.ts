import { SessionService } from './../services/session.service';
import { SecurityProvider } from './security/security';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { WaypointStatus } from '../models/waypointStatus';

@Injectable()
export class WaypointStatusProvider {

    constructor(private securityProvider: SecurityProvider,
        private sessionService: SessionService) {
    }

    /**
     * Vérifie qu'il est possible de passer d'un statut à un autre. Autrement dit, que le workflow est respecté.
     * @param currentStatus Le statut d'origine.
     * @param newStatus Le statut cible.
     * @return Vrai si la transition est acceptée, false sinon.
     */
    isTransitionOk(currentStatus: WaypointStatus, newStatus: WaypointStatus): boolean {
        // Pour une creation ou un brouillon, on n'a le droit de sauvegarder en brouillon ou en statut enregistré
        if (currentStatus === undefined || currentStatus === WaypointStatus.DRAFT) {
            //   // Liste des nouveaux statuts authorisés
            return [WaypointStatus.DRAFT].indexOf(newStatus) > -1 ||
                [WaypointStatus.REGISTERED].indexOf(newStatus) > -1;
        }
        // Pour un point d'étape en statut enregistrer, on a le droit que de le sauvegarder en statut enregistrer
        if (currentStatus === WaypointStatus.REGISTERED) {
            // Liste des nouveaux statuts authorisés
            return [WaypointStatus.REGISTERED].indexOf(newStatus) > -1;
        }
        return false;
    }

    /**
     * vérifie si le pnc connecté est un cadre
     * @return cadre ou pas cadre
     */
    isManager(): boolean {
        return this.sessionService.authenticatedUser.manager;
    }

}
