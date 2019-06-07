import { SessionService } from './../../../core/services/session/session.service';
import { TabNavModeEnum } from './../../../core/enums/tab-nav-mode.enum';
import { Component } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';

@Component({
    selector: 'pnc-edossier-header',
    templateUrl: 'pnc-edossier-header.component.html'
})
export class PncEdossierHeaderComponent {

    pnc: PncModel;

    TabNavModeEnum = TabNavModeEnum;

    constructor(private sessionService: SessionService) {
        this.pnc = this.sessionService.visitedPnc !== undefined ? this.sessionService.visitedPnc : this.sessionService.getActiveUser().authenticatedPnc;
    }

    /**
     * Navigation par onglet disponible uniquement lorsqu'on visite le eDossier d'une autre personne que soit même
     * @return vrai si la navigation par onglet est disponible, faux sinon
     */
    isTabNavAvailable(): boolean {
        return this.sessionService.visitedPnc && !this.sessionService.isActiveUser(this.sessionService.visitedPnc);
    }

}
