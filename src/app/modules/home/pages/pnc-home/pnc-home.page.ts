import { FormsInputParamsModel } from './../../../../core/models/forms-input-params.model';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';


import { TabNavEnum } from '../../../../core/enums/tab-nav.enum';
import { TabNavService } from '../../../../core/services/tab-nav/tab-nav.service';
import { ProfessionalLevelPage } from '../../../professional-level/pages/professional-level/professional-level.page';
import { SynchronizationService } from '../../../../core/services/synchronization/synchronization.service';
import { UpcomingFlightListPage } from '../../../flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { GenderService } from '../../../../core/services/gender/gender.service';
import { CareerObjectiveListPage } from '../../../development-program/pages/career-objective-list/career-objective-list.page';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { HelpAssetListPage } from '../../../help-asset/pages/help-asset-list/help-asset-list.page';
import { PncSearchPage } from '../../../pnc-team/pages/pnc-search/pnc-search.page';

import { StatutoryCertificatePage } from '../../../statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { SpecialityService } from '../../../../core/services/speciality/speciality.service';
import { CongratulationLettersPage } from '../../../congratulation-letter/pages/congratulation-letters/congratulation-letters.page';



@Component({
    selector: 'page-pnc-home',
    templateUrl: 'pnc-home.page.html',
})
export class PncHomePage {

    pnc: PncModel;
    matricule: string;
    synchroInProgress: boolean;
    eObservation: FormsInputParamsModel;
    // exporter la classe enum speciality dans la page html
    Speciality = SpecialityEnum;
    formatedSpeciality: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public genderService: GenderService,
        private toastService: ToastService,
        private synchronizationProvider: SynchronizationService,
        public connectivityService: ConnectivityService,
        private sessionService: SessionService,
        public translateService: TranslateService,
        private pncService: PncService,
        private events: Events,
        private statusBar: StatusBar,
        private tabNavService: TabNavService,
        private specialityService: SpecialityService,
    ) {

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
        if (this.navParams.get('matricule')) {
            this.matricule = this.navParams.get('matricule');
        } else if (this.sessionService.getActiveUser()) {
            this.matricule = this.sessionService.getActiveUser().matricule;
        }
        if (this.matricule != null) {
            this.pncService.getPnc(this.matricule).then(pnc => {
                this.pnc = pnc;
                this.formatedSpeciality = this.pncService.getFormatedSpeciality(this.pnc);
            }, error => {
            });
        }
    }

    /**
     * Dirige vers la page de visualisation des objectifs
     */
    goToCareerObjectiveList() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE));
        } else {
            this.navCtrl.push(CareerObjectiveListPage, { matricule: this.matricule });
        }
    }

    /**
     * Dirige vers la page des ressources d'aide
     */
    goToHelpAssetList() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE));
        } else {
            this.navCtrl.push(HelpAssetListPage, { pncRole: this.specialityService.getPncRole(this.pnc.speciality), matricule: this.matricule });
        }
    }

    /**
     * Dirige vers la liste des prochains vols
     */
    goToUpcomingFlightList() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE));
        } else {
            this.navCtrl.push(UpcomingFlightListPage, { matricule: this.matricule });
        }
    }

    /**
    * Dirige vers l'effectif PNC
    */
    goToPncSearch() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.PNC_SEARCH_PAGE));
        } else {
            this.navCtrl.push(PncSearchPage);
        }
    }

    /**
     * Dirige vers l'attestation réglementaire
     */
    goToStatutoryCertificate() {
        if (this.isMyHome() && !this.isManager()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.STATUTORY_CERTIFICATE_PAGE));
        } else {
            this.navCtrl.push(StatutoryCertificatePage, { matricule: this.matricule });
        }
    }

    /**
    * Dirige vers le suivi réglementaire
    */
    goToProfessionalLevel() {
        if (this.isMyHome() && !this.isManager()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.PROFESSIONAL_LEVEL_PAGE));
        } else {
            this.navCtrl.push(ProfessionalLevelPage, { matricule: this.matricule });
        }
    }

    goToCongratulationLetters() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(this.tabNavService.findTabIndex(TabNavEnum.CONGRATULATION_LETTERS_PAGE));
        } else {
            this.navCtrl.push(CongratulationLettersPage, { matricule: this.matricule });
        }
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
            }, error => {
            });
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

    /**
     * Vérifie que la page courante est la homepage de la personne connectée
     * @return vrai si c'est le cas, faux sinon
     */
    isMyHome(): boolean {
        return this.sessionService.isActiveUser(this.pnc);
    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.pnc && this.pnc.speciality === SpecialityEnum.CAD;
    }

}
