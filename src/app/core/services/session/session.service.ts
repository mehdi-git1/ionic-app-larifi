import { Injectable } from '@angular/core';

import { ParametersModel } from '../../models/parameters.model';
import { AppContextModel } from '../../models/app-context.model';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { PncModel } from '../../models/pnc.model';

@Injectable()
export class SessionService {
    authenticatedUser: AuthenticatedUserModel;
    impersonatedUser: AuthenticatedUserModel = null;
    appContext: AppContextModel = new AppContextModel();
    parameters: ParametersModel;

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
}
