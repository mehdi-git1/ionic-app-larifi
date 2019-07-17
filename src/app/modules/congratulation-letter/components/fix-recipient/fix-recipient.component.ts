import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncCardComponent } from '../../../../shared/components/pnc-card/pnc-card.component';
import { PncModel } from '../../../../core/models/pnc.model';
import { NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { CongratulationLetterService } from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Utils } from '../../../../shared/utils/utils';
import { PncSearchFilterComponent } from '../../../pnc-team/components/pnc-search-filter/pnc-search-filter.component';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import $ from 'jquery';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { CongratulationLetterFlightModel } from '../../../../core/models/congratulation-letter-flight.model';

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
            { airline: this.congratulationLetter.flight.airline, flightNumber: this.congratulationLetter.flight.number, flightDate: this.getFormatedFlightDate(this.congratulationLetter.flight)}),
            message: this.translateService.instant('CONGRATULATION_LETTERS.FIX_RECIPIENT.CONFIRMATION_POPOVER.LABEL',
            {oldPncConcernedLastName: this.pnc.lastName.toUpperCase(), oldPncConcernedFirstName: Utils.capitalize(this.pnc.firstName), newPncConcernedLastName: selectedPnc.lastName.toUpperCase(), newPncConcernedFirstName: Utils.capitalize(selectedPnc.firstName)}),
            buttons: [
                {
                    text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                    handler: () => {
                        this.congratulationLetterService.fixCongratulationLetterRecipient(this.congratulationLetter.techId, this.pnc.matricule, selectedPnc.matricule)
                        .then( congratulationLetter => {
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

}
