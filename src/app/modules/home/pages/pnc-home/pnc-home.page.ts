import { TabNavService } from './../../../../core/services/tab-nav/tab-nav.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { PncModel } from '../../../../core/models/pnc.model';

import { ProfessionalLevelPage } from '../../../professional-level/pages/professional-level/professional-level.page';
import { StatutoryCertificatePage } from '../../../statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { CongratulationLettersPage } from '../../../congratulation-letter/pages/congratulation-letters/congratulation-letters.page';

import { AppVersionAlertService } from './../../../../core/services/app-version/app-version-alert.service';
import { UserMessageAlertService } from './../../../../core/services/user-message/user-message-alert.service';
import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { TabNavEnum } from '../../../../core/enums/tab-nav.enum';

@Component({
    selector: 'page-pnc-home',
    templateUrl: 'pnc-home.page.html',
})
export class PncHomePage {

    pnc: PncModel;
    matricule: string;
    synchroInProgress: boolean;
    formatedSpeciality: string;

    constructor(private navCtrl: NavController,
        private toastService: ToastService,
        private synchronizationProvider: SynchronizationService,
        private translateService: TranslateService,
        private pncService: PncService,
        private events: Events,
        private statusBar: StatusBar,
        private userMessageAlertService: UserMessageAlertService,
        private appVersionAlertService: AppVersionAlertService,
        private tabNavService: TabNavService,
        private sessionService: SessionService
    ) {
        this.userMessageAlertService.handleUserMessage();
        this.appVersionAlertService.handleAppVersion();

        this.statusBar.styleLightContent();

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
        this.navCtrl.parent.select(this.tabNavService.getTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE));
    }

    /**
    * Dirige vers l'effectif PNC
    */
    goToPncSearch() {
        this.navCtrl.parent.select(this.tabNavService.getTabIndex(TabNavEnum.PNC_SEARCH_PAGE));
    }

    /**
     * Dirige vers la page des ressources d'aide
     */
    goToHelpAssetList() {
        this.navCtrl.parent.select(this.tabNavService.getTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE));
    }

    /**
     * Dirige vers l'attestation réglementaire
     */
    goToStatutoryCertificate() {
        this.navCtrl.push(StatutoryCertificatePage, { matricule: this.matricule });
    }

    /**
    * Dirige vers le suivi réglementaire
    */
    goToProfessionalLevel() {
        this.navCtrl.push(ProfessionalLevelPage, { matricule: this.matricule });
    }

    /**
    * Dirige vers les lettres de félicitation
    */
    goToCongratulationLetters() {
        this.navCtrl.push(CongratulationLettersPage, { matricule: this.matricule });
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
            this.toastService.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': this.pnc.matricule }));
        }, error => {
            this.synchroInProgress = false;
            this.toastService.error(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': this.pnc.matricule }));
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
