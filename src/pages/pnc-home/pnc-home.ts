import { PncRole } from './../../models/pncRole';
import { TranslateService } from '@ngx-translate/core';
import { UpcomingFlightListPage } from './../upcoming-flight-list/upcoming-flight-list';
import { SecurityProvider } from './../../providers/security/security';
import { SessionService } from './../../services/session.service';
import { ToastProvider } from './../../providers/toast/toast';
import { GenderProvider } from './../../providers/gender/gender';
import { Speciality } from './../../models/speciality';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Pnc } from '../../models/pnc';
import { Assignment } from '../../models/assignment';
import { HelpAssetListPage } from './../help-asset-list/help-asset-list';
@Component({
  selector: 'page-pnc-home',
  templateUrl: 'pnc-home.html',
})
export class PncHomePage {

  pnc: Pnc;
  matricule: string;
  // exporter la classe enum speciality dans la page html
  Speciality = Speciality;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private pncProvider: PncProvider,
    public genderProvider: GenderProvider,
    private toastProvider: ToastProvider,
    private securityProvider: SecurityProvider,
    private sessionService: SessionService,
    private events: Events,
    public translateService: TranslateService) {

    this.pnc = new Pnc();
    this.pnc.assignment = new Assignment();
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      if (this.sessionService.authenticatedUser) {
        this.loadPnc().then(success => {
          resolve();
        }, error => {
          reject();
        });

      } else {
        this.events.subscribe('user:authenticated', () => {
          this.matricule = this.sessionService.authenticatedUser.username;
          this.loadPnc().then(success => {
            resolve();
          }, error => {
            reject();
          });
        });
      }
    });
  }



  /**
   * charge le détail du pnc connecté ou consulté.
   */
  loadPnc(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si on a un matricule dans les params de navigation, cela surcharge le matricule du user connecté
      if (this.navParams.get('matricule')) {
        this.matricule = this.navParams.get('matricule');
      }

      if (this.matricule !== undefined) {
        this.pncProvider.getPnc(this.matricule).then(foundPnc => {
          this.pnc = foundPnc;
          resolve();
        }, error => {
          reject();
        });
      }
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

  
}
