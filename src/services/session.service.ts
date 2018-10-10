import { Pnc } from './../models/pnc';
import { Parameters } from './../models/Parameters';
import { AppContext } from './../models/appContext';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    authenticatedUser: AuthenticatedUser;
    impersonatedUser: AuthenticatedUser = null;
    appContext: AppContext = new AppContext();
    parameters: Parameters;

    /**
     * Retourne l'utilisateur "actif". Il s'agit de l'utilisateur connecté, ou de l'utilisateur impersonnifié si celui ci existe.
     */
    getActiveUser(): AuthenticatedUser {
        return this.impersonatedUser ? this.impersonatedUser : this.authenticatedUser;
    }
}
