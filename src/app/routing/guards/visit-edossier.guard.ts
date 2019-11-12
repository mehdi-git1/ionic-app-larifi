import { Observable } from 'rxjs';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { SessionService } from '../../core/services/session/session.service';

@Injectable()
export class VisitEdossierGuard implements CanActivate {
    constructor(
        private sessionService: SessionService,
        private pncService: PncService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        // Si le user connecté n'est pas un manager, on bloque la consultation des eDossiers
        if (!this.sessionService.getActiveUser().isManager) {
            return false;
        }

        // Si le PNC visité n'est pas en session, c'est qu'on accède directement à cette page via l'url
        // Il faut donc charger le PNC visité
        if (this.sessionService.visitedPnc === undefined) {
            return this.pncService.getPnc(route.paramMap.get('matricule')).then(pncFound => {
                this.sessionService.visitedPnc = pncFound;
                return true;
            });
        } else {
            return true;
        }
    }
}
