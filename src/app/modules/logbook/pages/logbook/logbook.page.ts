import { LogbookDetailsPage } from './../logbook-details/logbook-details.page';
import { SecurityService } from './../../../../core/services/security/security.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { LogbookEditPage } from '../logbook-edit/logbook-edit.page';

@Component({
    selector: 'log-book',
    templateUrl: 'logbook.page.html',
})
export class LogbookPage {

    pnc: PncModel;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private pncService: PncService,
        private securityService: SecurityService) {
        const matricule = this.navParams.get('matricule');
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
    }

    /**
     * Dirige vers la page d'édition d'un évènement du journal de bord
     */
    goToLogbookCreation() {
        if (this.pnc) {
            this.navCtrl.push(LogbookEditPage, { matricule: this.pnc.matricule });
        }
    }

    /**
     * Dirige vers la page de détail d'un évènement du journal de bord
     */
    goToLogbookDetails() {
        if (this.pnc) {
            this.navCtrl.push(LogbookDetailsPage);
        }
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return true;
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }
}

