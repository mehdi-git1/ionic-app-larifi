import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { CongratulationLetterCreatePage } from './../congratulation-letter-create/congratulation-letter-create.page';
import { TabHeaderEnum } from './../../../../core/enums/tab-header.enum';
import { PncService } from './../../../../core/services/pnc/pnc.service';
import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { CongratulationLetterModeEnum } from '../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { NavParams, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
    selector: 'congratulation-letters',
    templateUrl: 'congratulation-letters.page.html',
})
export class CongratulationLettersPage {

    matricule: string;

    pnc: PncModel;

    CongratulationLetterModeEnum = CongratulationLetterModeEnum;

    selectedCongratulationLetterMode: CongratulationLetterModeEnum;

    receivedCongratulationLetters: CongratulationLetterModel[];

    writtenCongratulationLetters: CongratulationLetterModel[];

    TabHeaderEnum = TabHeaderEnum;

    constructor(private navParams: NavParams,
        private navCtrl: NavController,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private sessionService: SessionService,
        private connectivityService: ConnectivityService) {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.RECEIVED;
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


        this.congratulationLetterService.getReceivedCongratulationLetters(this.matricule).then(receivedCongratulationLetters => {
            this.receivedCongratulationLetters = receivedCongratulationLetters;
        }, error => { });

        this.congratulationLetterService.getWrittenCongratulationLetters(this.matricule).then(writtenCongratulationLetters => {
            this.writtenCongratulationLetters = writtenCongratulationLetters;
        }, error => { });
    }

    /**
     * Affiche les lettres reçues
     */
    displayReceivedLetters(): void {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.RECEIVED;
    }

    /**
     * Affiche les lettres rédigées
     */
    displayWrittenLetters(): void {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.WRITTEN;
    }

    /**
     * Vérifie si un onglet est actif
     * @param mode le mode (onglet) à tester
     * @return vrai si le mode est actif, faux sinon
     */
    isTabActive(mode: CongratulationLetterModeEnum): boolean {
        return mode === this.selectedCongratulationLetterMode;
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.receivedCongratulationLetters !== undefined && this.writtenCongratulationLetters !== undefined;
    }

    /**
     * Redirige vers la page de création d'une nouvelle lettre
     */
    createNewLetter() {
        this.navCtrl.push(CongratulationLetterCreatePage);
    }

    /**
     * Vérifie si l'utilisateur peut créer une lettre. Pour créer une lettre, il faut être cadre, connecté, et ne pas être sur son propre dossier.
     * @return vrai si c'est le cas, faux sinon
     */
    canCreateLetter(): boolean {
        return this.connectivityService.isConnected()
            && this.sessionService.getActiveUser().matricule !== this.matricule
            && this.sessionService.getActiveUser().isManager;
    }
}
