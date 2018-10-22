import { Parameters } from './../models/Parameters';
import { AppContext } from './../models/appContext';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class AuthorizationService {

    constructor(private sessionService: SessionService) {
    }

    /**
     * Vérifie que l'utilisateur connecté a les droits
     *
     * @param permission nom de la permission
     * @return true si le user a les droits
     */
    hasPermission(permission: string): boolean {
        if (this.sessionService && this.sessionService.getActiveUser() && this.sessionService.getActiveUser().permissions
            && this.sessionService.getActiveUser().permissions.find(userRight => {
                return userRight === permission;
            })) {
            return true;
        }
        return false;
    }
}
