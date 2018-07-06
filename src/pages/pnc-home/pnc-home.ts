import { TranslateService } from '@ngx-translate/core';
import { UpcomingFlightListPage } from './../upcoming-flight-list/upcoming-flight-list';
import { SessionService } from './../../services/session.service';
import { GenderProvider } from './../../providers/gender/gender';
import { Speciality } from './../../models/speciality';
import { CareerObjectiveListPage } from './../career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { Pnc } from '../../models/pnc';
import { Assignment } from '../../models/assignment';
import { HelpAssetListPage } from './../help-asset-list/help-asset-list';
@Component({
  selector: 'page-pnc-home',
  templateUrl: 'pnc-home.html',
})
export class PncHomePage implements OnInit {

  pnc: Pnc;
  matricule: string;
  // exporter la classe enum speciality dans la page html
  Speciality = Speciality;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App,
    private pncProvider: PncProvider,
    public genderProvider: GenderProvider,
    private sessionService: SessionService,
    public translateService: TranslateService) {

    this.pnc = new Pnc();
    this.pnc.assignment = new Assignment();
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      if (this.navParams.get('matricule')) {
        this.matricule = this.navParams.get('matricule');
      } else if (this.sessionService.authenticatedUser) {
        this.matricule = JSON.parse(this.sessionService.authenticatedUser as any).username;
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
        this.pncProvider.getPnc(this.matricule).then(foundPnc => {
          this.pnc = foundPnc;
        }, error => {
        });
    }
  }

  /**
   * charge le détail du pnc connecté ou consulté.
   */
  loadPnc(matricule?: string) {
    return new Promise((resolve, reject) => {
      if (matricule) {
        this.matricule = matricule;
      } else if (this.navParams.get('matricule')) {
        this.matricule = this.navParams.get('matricule');
      } else if (this.sessionService.authenticatedUser) {
        this.matricule = JSON.parse(this.sessionService.authenticatedUser as any).username;
      } else {
        console.log('no matricule');
        reject();
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

}
