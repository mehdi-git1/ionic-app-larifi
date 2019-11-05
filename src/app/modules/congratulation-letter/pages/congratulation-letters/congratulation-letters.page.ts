import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from '@ionic/angular';

import {
    CongratulationLetterModeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'congratulation-letters',
    templateUrl: 'congratulation-letters.page.html',
    styleUrls: ['./congratulation-letters.page.scss']
})
export class CongratulationLettersPage {

    matricule: string;
    receivedLettersIsLoading: boolean;
    writtenLettersIsLoading: boolean;
    pnc: PncModel;

    CongratulationLetterModeEnum = CongratulationLetterModeEnum;

    selectedCongratulationLetterMode: CongratulationLetterModeEnum;

    receivedCongratulationLetters: CongratulationLetterModel[];

    writtenCongratulationLetters: CongratulationLetterModel[];

    TabHeaderEnum = TabHeaderEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private congratulationLetterService: CongratulationLetterService,
        private pncService: PncService,
        private events: Events,
        private sessionService: SessionService,
        private connectivityService: ConnectivityService,
        private location: Location) {
        this.selectedCongratulationLetterMode = CongratulationLetterModeEnum.RECEIVED;
        this.events.subscribe('CongratulationLetterList:refresh', () => {
            this.refresh();
        });
        this.events.subscribe('CongratulationLetter:deleted', () => {
            this.refresh();
        });
    }

    ionViewDidEnter() {
        this.initPage();
    }

    initPage() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.refresh();
    }

    refresh() {
        this.receivedLettersIsLoading = true;
        this.writtenLettersIsLoading = true;
        this.congratulationLetterService.getReceivedCongratulationLetters(this.matricule).then(receivedCongratulationLetters => {
            this.receivedCongratulationLetters = receivedCongratulationLetters;
            this.receivedLettersIsLoading = false;
        }, error => this.receivedLettersIsLoading = false);

        this.congratulationLetterService.getWrittenCongratulationLetters(this.matricule).then(writtenCongratulationLetters => {
            this.writtenCongratulationLetters = writtenCongratulationLetters;
            this.writtenLettersIsLoading = false;
        }, error => this.writtenLettersIsLoading = false);
    }

    /**
     * Rafraichit la page
     */
    refreshPage() {
        this.receivedCongratulationLetters = null;
        this.writtenCongratulationLetters = null;
        this.refresh();
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
        return this.pnc && !this.receivedLettersIsLoading && !this.writtenLettersIsLoading;
    }

    /**
     * Redirige vers la page de création d'une nouvelle lettre
     */
    createNewLetter() {
        this.router.navigate(['create', '0'], { relativeTo: this.activatedRoute });
    }

    /**
     * Vérifie si l'utilisateur peut créer une lettre. Pour créer une lettre, il faut être cadre,
     * connecté, et ne pas être sur son propre dossier.
     * @return vrai si c'est le cas, faux sinon
     */
    canCreateLetter(): boolean {
        return this.connectivityService.isConnected()
            && this.sessionService.getActiveUser().matricule !== this.matricule
            && this.sessionService.getActiveUser().isManager;
    }

    /**
     * Navigue en arrière dans l'historique de navigation
     */
    goBack() {
        this.location.back();
    }
}
