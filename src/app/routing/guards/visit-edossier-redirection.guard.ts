import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree
} from '@angular/router';

import { SessionService } from '../../core/services/session/session.service';

@Injectable()
export class VisitEdossierRedirectionGuard implements CanActivate {
    constructor(
        private sessionService: SessionService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // On ne peut rediriger vers une page que si le PNC visité est déjà en session
        if (this.sessionService.visitedPnc === undefined) {
            return false;
        }

        // Si le user connecté n'est pas un manager, on bloque la consultation des eDossiers
        if (this.sessionService.visitedPnc.manager) {
            this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'statutory-certificate']);
        } else {
            this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'development-program']);
        }

        return true;
    }
}
