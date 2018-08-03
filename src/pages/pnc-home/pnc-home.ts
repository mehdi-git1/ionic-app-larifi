import { AuthGuard } from './../../guard/auth.guard';
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
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, App, IonicPage } from 'ionic-angular';
import { Pnc } from '../../models/pnc';
import { ConnectivityService } from '../../services/connectivity.service';
import { SummarySheetPage } from '../summary-sheet/summary-sheet';
import { HelpAssetListPage } from './../help-asset-list/help-asset-list';
import { PncSearchPage } from './../pnc-search/pnc-search';

@IonicPage({
  name: 'PncHomePage',
  segment: 'pncHome/:matricule'
})
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
    public viewCtrl: ViewController,
    public appCtrl: App,
    public zone: NgZone,
    public cd: ChangeDetectorRef,
    public genderProvider: GenderProvider,
    private toastProvider: ToastProvider,
    private synchronizationProvider: SynchronizationProvider,
    public connectivityService: ConnectivityService,
    private sessionService: SessionService,
    public translateService: TranslateService,
    private pncProvider: PncProvider,
    private authGuard: AuthGuard
  ) {

  }

  ionViewCanEnter() {
    return this.authGuard.guard().then(guardReturn => {
      if (guardReturn) {
        if (this.navParams.get('matricule')) {
          this.matricule = this.navParams.get('matricule');
        } else if (this.sessionService.appContext.observedPncMatricule) {
          this.matricule = this.sessionService.appContext.observedPncMatricule;
        } else if (this.sessionService.authenticatedUser) {
          this.matricule = this.sessionService.authenticatedUser.matricule;
        }

        if (this.matricule != null) {
          this.pncProvider.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
            return true;
          }, error => {
            return false;
          });
        }
      } else {
        return false;
      }
    });
  }

  /**
   * charge le détail du pnc connecté ou consulté.
   */
  loadPnc(matricule?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si on a un matricule dans les params de navigation, cela surcharge le matricule du user connecté
      if (this.sessionService.appContext.observedPncMatricule) {
        this.matricule = this.sessionService.appContext.observedPncMatricule;
      }

      this.navCtrl.setRoot('PncHomePage', { matricule: this.matricule });
    });
  }

  /**
   * Dirige vers la page de visualisation des objectifs
   */
  goToCareerObjectiveList() {
    this.navCtrl.push('CareerObjectiveListPage', { matricule: this.matricule });
  }

  /**
   * Dirige vers la page des ressources d'aide
   */
  goToHelpAssetList() {
    this.navCtrl.push('HelpAssetListPage', { pncRole: Speciality.getPncRole(this.pnc.speciality) });
  }

  /**
   * Dirige vers la liste des prochains vols
   */

  goToUpcomingFlightList() {
    this.navCtrl.push('UpcomingFlightListPage', { matricule: this.matricule });
  }

  /**
   * Redirige vers le EDossier du PNC saisi
   */
  goToEdossier() {
    this.navCtrl.push('PncHomePage', { matricule: this.matricule });
  }

  /**
   * Précharge le eDossier du PNC si celui n'est pas cadre
   */
  downloadPncEdossier() {
    this.synchroInProgress = true;
    this.synchronizationProvider.storeEDossierOffline(this.pnc.matricule).then(success => {
      this.loadPnc();
      this.synchroInProgress = false;
      this.toastProvider.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': this.pnc.matricule }));
    }, error => {
      this.synchroInProgress = false;
      this.toastProvider.error(
        this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': this.pnc.matricule }));
    });
  }

  /**
   * Dirige vers l'effectif PNC
   */
  goToPncSearch() {
    this.navCtrl.push('PncSearchPage');
  }

  goToSummarySheet() {
    this.navCtrl.push('SummarySheetPage', { matricule: this.matricule });
  }
}
