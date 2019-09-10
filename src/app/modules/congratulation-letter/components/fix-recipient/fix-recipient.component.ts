import { AlertController, Events, NavParams, ViewController } from 'ionic-angular';

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    CongratulationLetterFlightModel
} from '../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'fix-recipient',
    templateUrl: 'fix-recipient.component.html'
})
export class FixRecipientComponent {

    pnc: PncModel;
    selectedPnc: PncModel;
    congratulationLetter: CongratulationLetterModel;

    constructor(private navParams: NavParams,
        public congratulationLetterService: CongratulationLetterService,
        public translateService: TranslateService,
        private toastService: ToastService,
        public viewCtrl: ViewController,
        private pncProvider: PncService,
        private alertCtrl: AlertController,
        private events: Events) {
        this.congratulationLetter = this.navParams.get('congratulationLetter');
        this.pnc = this.navParams.get('pnc');
    }

    /**
     * Annule et ferme la popup
     */
    cancel() {
        this.viewCtrl.dismiss();
    }

    /**
     * Présente une alerte pour confirmer la correction du destinataire
     */
    fixRecipient(selectedPnc: PncModel) {
        this.alertCtrl.create({
            title: this.translateService.instant('CONGRATULATION_LETTERS.FIX_RECIPIENT.CONFIRMATION_POPOVER.TITLE',
                { airline: Utils.getEmptyStringIfNull(this.congratulationLetter.flight.airline), flightNumber: Utils.getEmptyStringIfNull(this.congratulationLetter.flight.number), flightDate: this.getFormatedFlightDate(this.congratulationLetter.flight) }),
            message: this.translateService.instant('CONGRATULATION_LETTERS.FIX_RECIPIENT.CONFIRMATION_POPOVER.LABEL',
                { oldPncConcernedLastName: this.pnc.lastName.toUpperCase(), oldPncConcernedFirstName: Utils.capitalize(this.pnc.firstName), newPncConcernedLastName: selectedPnc.lastName.toUpperCase(), newPncConcernedFirstName: Utils.capitalize(selectedPnc.firstName) }),
            buttons: [
                {
                    text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                    handler: () => {
                        this.congratulationLetterService.fixCongratulationLetterRecipient(this.congratulationLetter.techId, this.pnc.matricule, selectedPnc.matricule)
                            .then(congratulationLetter => {
                                this.events.publish('CongratulationLetterList:refresh');
                                this.viewCtrl.dismiss();
                                this.toastService.info(this.translateService.instant('CONGRATULATION_LETTERS.FIX_RECIPIENT.RECIPIENT_FIXED'));
                            }
                            );
                    }
                }
            ]
        }).present();
    }

    /**
     * Vérifie si un Pnc a été séléctionné
     * @return true si un Pnc a été séléctionné, false sinon
     */
    pncHasBeenSelected(): boolean {
        return this.selectedPnc && this.selectedPnc !== undefined && this.selectedPnc.matricule != null;
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
     * Récupère une chaine de caractère vide si la valeur est null
     * @param value la chaine à traiter
     * @return une chaine vide, ou la valeur passée en paramètre si celle ci est non null
     */
    getEmptyStringIfNull(value: string): string {
        return Utils.getEmptyStringIfNull(value);
    }
}
