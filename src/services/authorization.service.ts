import { Parameters } from './../models/Parameters';
import { AppContext } from './../models/appContext';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable()
export class AuthorizationService {

    constructor(public sessionService: SessionService) {
    }

    hasPermission(permission: string) {
          if (this.sessionService && this.sessionService.authenticatedUser && this.sessionService.authenticatedUser.permissions && this.sessionService.authenticatedUser.permissions.find(userRight => {
                    return userRight === permission;
               })) {
               return true;
          }
          return false;
     }
}
