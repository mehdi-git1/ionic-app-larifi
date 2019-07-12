import { CongratulationLetterRedactorTypeEnum } from './../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import { CongratulationLetterFlightModel } from './../../../../core/models/congratulation-letter-flight.model';
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

    CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;

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
     * Teste si le chargement des ressources est terminé
     * @return vrai si c'est le cas, faux sinon
     */
    pageLoadingIsOver(): boolean {
        return this.congratulationLetter !== undefined;
    }

    /**
     * Vérifie s'il s'agit d'une lettre que l'utilisateur a rédigé
     * @return vrai si la lettre a été rédigée par l'utilisateur, faux sinon
     */
    isWrittenLetter(): boolean {
        return this.congratulationLetter.redactor && this.matricule === this.congratulationLetter.redactor.matricule;
    }

    /**
     * Retourne la date du vol, formatée pour l'affichage
     * @param flight le vol dont on souhaite avoir la date formatée
     * @return la date formatée du vol
     */
    getFormatedFlightDate(flight: CongratulationLetterFlightModel): string {
        return this.congratulationLetterService.getFormatedFlightDate(flight);
    }

}
