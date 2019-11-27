import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    CongratulationLetterRedactorTypeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import {
    CongratulationLetterFlightModel
} from '../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'congratulation-letter-detail',
    templateUrl: 'congratulation-letter-detail.page.html',
    styleUrls: ['./congratulation-letter-detail.page.scss']
})
export class CongratulationLetterDetailPage {

    matricule: string;
    pnc: PncModel;

    congratulationLetter: CongratulationLetterModel;

    CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;
    TextEditorModeEnum = TextEditorModeEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private datePipe: DatePipe
    ) {
    }

    ionViewDidEnter() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });

        this.congratulationLetterService.getCongratulationLetter(
            parseInt(this.activatedRoute.snapshot.paramMap.get('congratulationLetterId'), 10))
            .then(congratulationLetter => {
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
