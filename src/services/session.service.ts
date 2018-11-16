import { Pnc } from '../app/core/models/pnc';
import { Parameters } from '../app/core/models/Parameters';
import { AppContext } from '../app/core/models/appContext';
import { AuthenticatedUser } from '../app/core/models/authenticatedUser';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    authenticatedUser: AuthenticatedUser;
    impersonatedUser: AuthenticatedUser = null;
    appContext: AppContext = new AppContext();
    parameters: Parameters;

    /**
     * Retourne l'utilisateur "actif". Il s'agit de l'utilisateur connecté, ou de l'utilisateur impersonnifié si celui ci existe.
     * @return l'utilisateur actif
     */
    getActiveUser(): AuthenticatedUser {
        return this.impersonatedUser ? this.impersonatedUser : this.authenticatedUser;
    }
}
