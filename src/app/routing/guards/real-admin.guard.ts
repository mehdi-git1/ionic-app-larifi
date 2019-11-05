import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { SecurityService } from '../../core/services/security/security.service';
import { SessionService } from '../../core/services/session/session.service';

@Injectable()
export class RealAdminGuard implements CanActivate {
    constructor(
        private securityService: SecurityService,
        private sessionService: SessionService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // On souhaite tester les droits du véritable utilisateur connecté (pas la personne éventuellement impersonnifiée)
        return this.securityService.isAdmin(this.sessionService.authenticatedUser);
    }
}
