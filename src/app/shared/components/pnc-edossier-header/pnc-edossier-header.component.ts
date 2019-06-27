import { NavController, Events } from 'ionic-angular';
import { SessionService } from './../../../core/services/session/session.service';
import { TabHeaderModeEnum } from '../../../core/enums/tab-header-mode.enum';
import { Component, OnInit, Input } from '@angular/core';
import { PncModel } from '../../../core/models/pnc.model';
import { TabHeaderEnum } from '../../../core/enums/tab-header.enum';

@Component({
    selector: 'pnc-edossier-header',
    templateUrl: 'pnc-edossier-header.component.html'
})
export class PncEdossierHeaderComponent implements OnInit {

    pnc: PncModel;

    @Input() activeTab: TabHeaderEnum;

    TabHeaderModeEnum = TabHeaderModeEnum;

    constructor(private sessionService: SessionService,
        private navCtrl: NavController,
        private events: Events) {

        this.events.subscribe('changeTab', () => {
            this.init();
        });
    }

    ngOnInit() {
        this.init();
    }

    /**
     * Initialisation du composant
     */
    init() {
        // On affiche le header de navigation du PNC visité que si on ne se trouve pas sur le premier onglet de la navbar
        if (this.sessionService.visitedPnc !== undefined && this.isVisitedPncTabSelected()) {
            this.pnc = this.sessionService.visitedPnc;
        } else {
            this.pnc = this.sessionService.getActiveUser().authenticatedPnc;
        }
    }

    /**
     * Navigation par onglet disponible uniquement lorsqu'on visite le eDossier d'une autre personne que soit même
     * @return vrai si la navigation par onglet est disponible, faux sinon
     */
    isTabNavAvailable(): boolean {
        return !this.sessionService.getActiveUser().isManager
            || this.isVisitedPncTabSelected();
    }

    /**
     * Teste si l'onglet de la navBar sélectionné est sur les onglets des dossiers visités
     * @return vrai si c'est le cas, faux sinon
     */
    isVisitedPncTabSelected(): boolean {
        return this.navCtrl.parent && this.navCtrl.parent.getSelected() && (this.navCtrl.parent.getSelected().id == 't0-3' || this.navCtrl.parent.getSelected().id == 't0-4');
    }

}
