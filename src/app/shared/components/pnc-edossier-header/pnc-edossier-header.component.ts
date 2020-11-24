import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

import { TabHeaderEnum } from '../../../core/enums/tab-header.enum';
import { PncModel } from '../../../core/models/pnc.model';
import { SessionService } from '../../../core/services/session/session.service';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';

@Component({
    selector: 'pnc-edossier-header',
    templateUrl: 'pnc-edossier-header.component.html',
    styleUrls: ['./pnc-edossier-header.component.scss']
})
export class PncEdossierHeaderComponent implements OnChanges {

    @Input() activeTab: TabHeaderEnum;

    pnc: PncModel;

    constructor(
        private events: Events,
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private pncService: PncService,
        private tabNavService: TabNavService) {

        this.events.subscribe('tabChange', () => {
            this.init();
        });
    }

    ngOnChanges() {
        this.init();
    }

    /**
     * Initialisation du composant
     */
    init() {
        if (this.activatedRoute.snapshot.paramMap.get('matricule')) {
            this.pncService.getPnc(this.activatedRoute.snapshot.paramMap.get('matricule')).then(pnc => {
                this.pnc = pnc;
            });
        } else if (this.sessionService.visitedPnc !== undefined && this.isVisitedPncTabSelected()) {
            // On affiche le header de navigation du PNC visité que si on ne se trouve pas sur le premier onglet de la navbar
            this.pnc = this.sessionService.visitedPnc;
        } else if (!this.sessionService.getActiveUser().isManager) {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        } else {
            this.pnc = null;
        }
    }

    /**
     * Navigation par onglet disponible uniquement lorsqu'on visite le eDossier d'une autre personne que soit même
     * @return vrai si la navigation par onglet est disponible, faux sinon
     */
    isTabNavAvailable(): boolean {
        return (!this.sessionService.getActiveUser().isManager
            || this.isVisitedPncTabSelected())
            && this.activatedRoute.snapshot.paramMap.get('matricule') === null;
    }

    /**
     * Teste si l'onglet de la navBar sélectionné est sur les onglets des dossiers visités
     * @return vrai si c'est le cas, faux sinon
     */
    isVisitedPncTabSelected(): boolean {
        return this.tabNavService.isVisitedPncTabSelected();
    }

}
