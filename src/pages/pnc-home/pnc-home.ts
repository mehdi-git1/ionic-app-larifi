import { SummarySheetPage } from './../summary-sheet/summary-sheet';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { TranslateService } from '@ngx-translate/core';
import { UpcomingFlightListPage } from './../upcoming-flight-list/upcoming-flight-list';
import { SessionService } from './../../services/session.service';
import { ToastProvider } from './../../providers/toast/toast';
import { GenderProvider } from './../../providers/gender/gender';
import { EObservation } from './../../models/eObservation';
import { Speciality } from './../../models/speciality';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Pnc } from '../../models/pnc';
import { ConnectivityService } from '../../services/connectivity.service';
import { HelpAssetListPage } from './../help-asset-list/help-asset-list';
import { PncSearchPage } from './../pnc-search/pnc-search';
import { StatusBar } from '@ionic-native/status-bar';
import { StatutoryCertificatePage } from '../statutory-certificate/statutory-certificate';


@Component({
    selector: 'page-pnc-home',
    templateUrl: 'pnc-home.html',
})
export class PncHomePage {

    pnc: Pnc;
    matricule: string;
    synchroInProgress: boolean;
    eObservation: EObservation;
    // exporter la classe enum speciality dans la page html
    Speciality = Speciality;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public genderProvider: GenderProvider,
        private toastProvider: ToastProvider,
        private synchronizationProvider: SynchronizationProvider,
        public connectivityService: ConnectivityService,
        private sessionService: SessionService,
        public translateService: TranslateService,
        private pncProvider: PncProvider,
        private events: Events,
        private statusBar: StatusBar) {

        this.statusBar.styleLightContent();

        this.events.subscribe('EDossierOffline:stored', () => {
            if (this.matricule != null) {
                this.pncProvider.getPnc(this.matricule).then(pnc => {
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
            this.pncProvider.getPnc(this.matricule).then(pnc => {
                this.pnc = pnc;
            }, error => {
            });
        }
    }

    /**
     * Dirige vers la page de visualisation des objectifs
     */
    goToCareerObjectiveList() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(1);
        } else {
            this.navCtrl.push(CareerObjectiveListPage, { matricule: this.matricule });
        }
    }

    /**
     * Dirige vers la page des ressources d'aide
     */
    goToHelpAssetList() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(3);
        } else {
            this.navCtrl.push(HelpAssetListPage, { pncRole: Speciality.getPncRole(this.pnc.speciality) });
        }
    }

    /**
     * Dirige vers la liste des prochains vols
     */

    goToUpcomingFlightList() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(2);
        } else {
            this.navCtrl.push(UpcomingFlightListPage, { matricule: this.matricule });
        }
    }

    /**
     * Redirige vers le EDossier du PNC saisi
     */
    goToEdossier() {
        this.navCtrl.push(PncHomePage, { matricule: this.matricule });
    }

    /**
    * Dirige vers l'effectif PNC
    */
    goToPncSearch() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(1);
        } else {
            this.navCtrl.push(PncSearchPage);
        }
    }

    /**
     * Dirige vers la fiche synthèse
     */
    goToSummarySheet() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(2);
        } else {
            this.navCtrl.push(SummarySheetPage, { matricule: this.matricule });
        }
    }

    /**
     * Dirige vers l'attestation réglementaire
     */
    goToStatutoryCertificate() {
        if (this.isMyHome()) {
            this.navCtrl.parent.select(4);
        } else {
            this.navCtrl.push(StatutoryCertificatePage, { matricule: this.matricule });
        }
    }

    /**
     * Précharge le eDossier du PNC si celui n'est pas cadre
     */
    downloadPncEdossier() {
        this.synchroInProgress = true;
        this.synchronizationProvider.storeEDossierOffline(this.pnc.matricule).then(success => {
            // Appel au getPnc pour mise a jour de l'indicateur offLine
            this.pncProvider.getPnc(this.matricule).then(pnc => {
                this.pnc = pnc;
            }, error => {
            });
            this.synchroInProgress = false;
            this.toastProvider.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': this.pnc.matricule }));
        }, error => {
            this.synchroInProgress = false;
            this.toastProvider.error(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': this.pnc.matricule }));
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
        return this.matricule === (this.sessionService.getActiveUser() && this.sessionService.getActiveUser().matricule);
    }

}
