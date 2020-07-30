import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { SessionService } from '../../core/services/session/session.service';
import { TabNavService } from '../../core/services/tab-nav/tab-nav.service';

@Injectable()
export class VisitEdossierGuard implements CanActivate {
    constructor(
        private sessionService: SessionService,
        private tabNavService: TabNavService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        // Si le user connecté n'est pas un manager, on bloque la consultation des eDossiers
        if (!this.sessionService.getActiveUser().isManager) {
            return false;
        }

        // On déclenche la "visite" d'un dossier :
        // 1. Si aucun PNC visité n'est présent en session
        // 2. Si le matricule présent dans l'url est différent de celui présent en session
        if (this.sessionService.visitedPnc === undefined || this.sessionService.visitedPnc.matricule !== route.paramMap.get('matricule')) {
            return this.tabNavService.loadVisitedPnc(route.paramMap.get('matricule')).then(() => true);
        } else {
            return true;
        }
    }
}
