import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { PncModel } from '../../../../core/models/pnc.model';
import {
    AppVersionAlertService
} from '../../../../core/services/app-version/app-version-alert.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    UserMessageAlertService
} from '../../../../core/services/user-message/user-message-alert.service';

@Component({
    selector: 'page-pnc-home',
    templateUrl: 'pnc-home.page.html',
    styleUrls: ['./pnc-home.page.scss']
})
export class PncHomePage {

    pnc: PncModel;
    matricule: string;
    synchroInProgress: boolean;
    formatedSpeciality: string;

    constructor(
        private router: Router,
        private toastService: ToastService,
        private synchronizationProvider: SynchronizationService,
        private translateService: TranslateService,
        private pncService: PncService,
        private events: Events,
        private userMessageAlertService: UserMessageAlertService,
        private appVersionAlertService: AppVersionAlertService,
        private sessionService: SessionService,
        private activatedRoute: ActivatedRoute
    ) {
        this.userMessageAlertService.handleUserMessage();
        this.appVersionAlertService.handleAppVersion();


        this.events.subscribe('EDossierOffline:stored', () => {
            if (this.matricule != null) {
                this.pncService.getPnc(this.matricule).then(pnc => {
                    this.pnc = pnc;
                }, error => {
                });
            }
        });
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.matricule = this.sessionService.getActiveUser().matricule;
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
            this.formatedSpeciality = this.pncService.getFormatedSpeciality(this.pnc);
        }, error => { });
    }

    /**
     * Dirige vers la liste des prochains vols
     */
    goToUpcomingFlightList() {
        this.router.navigate(['../..', 'flight'], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers l'effectif PNC
     */
    goToPncSearch() {
        this.router.navigate(['../..', 'search'], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers la page des ressources d'aide
     */
    goToHelpAssetList() {
        this.router.navigate(['../..', 'help'], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers l'attestation réglementaire
     */
    goToStatutoryCertificate() {
        this.router.navigate(['statutory-certificate'], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers le suivi réglementaire
     */
    goToProfessionalLevel() {
        this.router.navigate(['professional-level'], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers les lettres de félicitations
     */
    goToCongratulationLetters() {
        this.router.navigate(['congratulation-letter'], { relativeTo: this.activatedRoute });
    }

    /**
     * Dirige vers les rédactions
     */
    goToRedactions() {
        this.router.navigate(['redactions'], { relativeTo: this.activatedRoute });
    }

    /**
     * Précharge le eDossier du PNC si celui n'est pas cadre
     */
    downloadPncEdossier() {
        this.synchroInProgress = true;
        this.synchronizationProvider.storeEDossierOffline(this.pnc.matricule).then(success => {
            // Appel au getPnc pour mise a jour de l'indicateur offLine
            this.pncService.getPnc(this.matricule).then(pnc => {
                this.pnc = pnc;
            }, error => { });
            this.synchroInProgress = false;
            this.toastService.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { matricule: this.pnc.matricule }));
        }, error => {
            this.synchroInProgress = false;
            this.toastService.error(this.translateService
                .instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { matricule: this.pnc.matricule }));
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc !== undefined;
    }

}
