import { CongratulationLetterModel } from './../../../../core/models/congratulation-letter.model';
import { SessionService } from './../../../../core/services/session/session.service';
import { PncModel } from './../../../../core/models/pnc.model';
import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'congratulation-letter-detail',
    templateUrl: 'congratulation-letter-detail.page.html',
})
export class CongratulationLetterDetailPage {

    matricule: string;
    pnc: PncModel;

    congratulationLetter: CongratulationLetterModel;

    constructor(private navParams: NavParams,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private sessionService: SessionService
    ) {
    }

    ionViewDidEnter() {
        if (this.navParams.get('matricule')) {
            this.matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            this.matricule = this.sessionService.getActiveUser().matricule;
        }
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });

        this.congratulationLetterService.getCongratulationLetter(this.navParams.get('congratulationLetterId')).then(congratulationLetter => {
            this.congratulationLetter = congratulationLetter;
        }, error => { });
    }

    /**
     * Teste si le chargement des ressources sont terminées
     * @return vrai si c'est le cas, faux sinon
     */
    pageLoadingIsOver(): boolean {
        return this.congratulationLetter !== undefined;
    }


}
