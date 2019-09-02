import { NavParams } from 'ionic-angular';

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import {
    CongratulationLetterRedactorTypeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import {
    CongratulationLetterFlightModel
} from '../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { Utils } from '../../../../shared/utils/utils';

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
        private sessionService: SessionService,
        private datePipe: DatePipe
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

    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification au format dd/mm/yyyy hh:mm
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.congratulationLetter.lastUpdateDate, 'dd/MM/yyyy HH:mm');
    }

    /**
     * Récupère une chaine de caractère vide si la valeur est null
     * @return une chaine vide, ou la valeur passée en paramètre si celle ci est non null
     */
    getEmptyStringIfNull(value: string) {
        return Utils.getEmptyStringIfNull(value);
    }
}
