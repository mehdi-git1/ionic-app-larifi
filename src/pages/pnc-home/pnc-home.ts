import { TranslateService } from '@ngx-translate/core';
import { UpcomingFlightListPage } from './../upcoming-flight-list/upcoming-flight-list';
import { SessionService } from './../../services/session.service';
import { SecurityProvider } from './../../providers/security/security';
import { ToastProvider } from './../../providers/toast/toast';
import { GenderProvider } from './../../providers/gender/gender';
import { EObservationService } from './../../services/eObservation.service';
import { EObservation } from './../../models/eObservation';
import { Speciality } from './../../models/speciality';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { Pnc } from '../../models/pnc';
import { Assignment } from '../../models/assignment';
import { SummarySheetPage } from '../summary-sheet/summary-sheet';
import { HelpAssetListPage } from './../help-asset-list/help-asset-list';

@Component({
  selector: 'page-pnc-home',
  templateUrl: 'pnc-home.html',
})
export class PncHomePage implements OnInit {

  pnc: Pnc;
  matricule: string;
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
    private sessionService: SessionService,
    public translateService: TranslateService,
    private pncProvider: PncProvider) {

  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      if (this.navParams.get('matricule')) {
        this.matricule = this.navParams.get('matricule');
      } else if (this.sessionService.appContext.observedPncMatricule) {
        this.matricule = this.sessionService.appContext.observedPncMatricule;
      } else if (this.sessionService.authenticatedUser) {
        this.matricule = JSON.parse(this.sessionService.authenticatedUser as any).matricule;
      } else {
        console.log('no matricule');
      }

      if (this.matricule != null){
        resolve();
      }
       else{
         reject();
       }
    });
  }

  ngOnInit(): void {
    if (this.matricule != null) {
      this.zone.run(() => {
        this.pncProvider.getPnc(this.matricule).subscribe(pnc => {
          this.pnc = pnc;
          this.cd.markForCheck();
        }, error => {
          this.pnc = null;
        });
      });
    }
  }

  /**
   * charge le détail du pnc connecté ou consulté.
   */
  loadPnc(matricule?: string) {
    return new Promise((resolve, reject) => {
      // Si on a un matricule dans les params de navigation, cela surcharge le matricule du user connecté
      if (this.sessionService.appContext.observedPncMatricule) {
        this.matricule = this.sessionService.appContext.observedPncMatricule;
      }

      this.navCtrl.setRoot(PncHomePage, { matricule: this.matricule });
    });
  }

  /**
   * Dirige vers la page de visualisation des objectifs
   */
  goToCareerObjectiveList() {
    this.navCtrl.push(CareerObjectiveListPage, { matricule: this.matricule });
  }

  /**
   * Dirige vers la page des ressources d'aide
   */
  goToHelpAssetList() {
    this.navCtrl.push(HelpAssetListPage, { pncRole: Speciality.getPncRole(this.pnc.speciality) });
  }

  /**
   * Dirige vers la liste des prochains vols
   */

  goToUpcomingFlightList() {
    this.navCtrl.push(UpcomingFlightListPage, { matricule: this.matricule });
  }

  /**
   * Redirige vers le EDossier du PNC saisi
   */
  goToEdossier() {
    this.navCtrl.push(PncHomePage, { matricule: this.matricule });
  }

  goToSummarySheet() {
    this.navCtrl.push(SummarySheetPage, { matricule: this.matricule });
  }
}
