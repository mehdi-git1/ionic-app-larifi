import { Injectable } from '@angular/core';

import { AppContextModel } from '../../models/app-context.model';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { PncModel } from '../../models/pnc.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
    authenticatedUser: AuthenticatedUserModel;
    impersonatedUser: AuthenticatedUserModel = null;
    appContext: AppContextModel = new AppContextModel();
    // Dernier pnc "visité" (le dernier eDossier qu'on a visité)
    visitedPnc: PncModel;

    /**
     * Retourne l'utilisateur "actif". Il s'agit de l'utilisateur connecté, ou de l'utilisateur impersonnifié si celui ci existe.
     * @return l'utilisateur actif
     */
    getActiveUser(): AuthenticatedUserModel {
        return this.impersonatedUser ? this.impersonatedUser : this.authenticatedUser;
    }

    /**
     * Vérifie que le pnc consulté est la personne connectée
     * @return vrai si c'est le cas, faux sinon
     */
    isActiveUser(pnc: PncModel): boolean {
        if (!pnc) {
            return false;
        }
        return pnc.matricule === (this.getActiveUser() && this.getActiveUser().matricule);
    }

    /**
     * Vérifie que le pnc consulté est la personne connectée
     * @return vrai si c'est le cas, faux sinon
     */
    isActiveUserMatricule(matricule: string): boolean {
        if (!matricule) {
            return false;
        }
        return matricule === (this.getActiveUser() && this.getActiveUser().matricule);
    }
}
