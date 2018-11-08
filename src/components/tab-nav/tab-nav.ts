import { ProfessionalLevelPage } from './../../pages/professional-level/professional-level';
import { SessionService } from './../../services/session.service';
import { PncProvider } from './../../providers/pnc/pnc';
import { Nav, Events, Tabs } from 'ionic-angular';
import { SummarySheetPage } from './../../pages/summary-sheet/summary-sheet';
import { PncSearchPage } from './../../pages/pnc-search/pnc-search';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';
import { UpcomingFlightListPage } from './../../pages/upcoming-flight-list/upcoming-flight-list';
import { HelpAssetListPage } from './../../pages/help-asset-list/help-asset-list';
import { CareerObjectiveListPage } from './../../pages/career-objective-list/career-objective-list';

import { Pnc } from './../../models/pnc';
import { Component, Input, ViewChild } from '@angular/core';
import { Speciality } from './../../models/speciality';
import { TranslateService } from '@ngx-translate/core';
import { StatutoryCertificatePage } from '../../pages/statutory-certificate/statutory-certificate';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.html'
})
export class TabNavComponent {

  @Input() pnc: Pnc;
  @Input() navCtrl: Nav;

  _matricule: string;

  @Input()
  set matricule(matricule: string) {
    if (matricule) {
      this.pncProvider.getPnc(matricule).then(pnc => {
        this._matricule = matricule;
        this.pnc = pnc;
        this.pncParams = this.pnc;
        this.matriculeParams = { matricule: this.pnc.matricule };
        this.roleParams = { pncRole: Speciality.getPncRole(this.pnc.speciality) };
        this.navCtrl.popToRoot();
      }, error => {
      });
    }
  }

  @ViewChild('tabs') tabs: Tabs;

  // exporter la classe enum speciality dans la page html
  Speciality = Speciality;

  // Pages du Tab
  pncHomePage = PncHomePage;
  pncSearchPage = PncSearchPage;
  careerObjectiveListPage = CareerObjectiveListPage;
  helpAssetListPage = HelpAssetListPage;
  upcomingFlightListPage = UpcomingFlightListPage;
  summarySheetPage = SummarySheetPage;
  statutoryCertificatePage = StatutoryCertificatePage;
  professionalLevelPage = ProfessionalLevelPage;

  // Paramètres envoyés aux pages
  pncParams;
  matriculeParams;
  roleParams;

  tabObject = {
    pncHome: { title: '', page: '' },
    developementProgram: { title: '', page: '' },
    pncSummarySheet: { title: '', page: '' },
    pncTeam: { title: '', page: '' },
    upcomingFlight: { title: '', page: '' },
    helpCenter: { title: '', page: '' },
    statutoryCertificate: { title: '', page: '' },
    professionalLevel: { title: '', page: '' }
  };

  constructor(
    private events: Events,
    private sessionService: SessionService,
    private pncProvider: PncProvider,
    private translate: TranslateService) {
    this.initTabObject();
  }

  /**
   * Fonction d'initialisation des titres dynamiquement
   */
  initTabObject() {
    this.tabObject.pncHome.title = this.translate.instant('PNC_HOME.TITLE');
    this.tabObject.developementProgram.title = this.translate.instant('GLOBAL.DEVELOPMENT_PROGRAM');
    this.tabObject.pncSummarySheet.title = this.translate.instant('GLOBAL.PNC_SUMMARY_SHEET');
    this.tabObject.pncTeam.title = this.translate.instant('GLOBAL.PNC_TEAM');
    this.tabObject.upcomingFlight.title = this.translate.instant('GLOBAL.UPCOMING_FLIGHT');
    this.tabObject.helpCenter.title = this.translate.instant('GLOBAL.HELP_CENTER');
    this.tabObject.statutoryCertificate.title = this.translate.instant('GLOBAL.STATUTORY_CERTIFICATE');
    this.tabObject.professionalLevel.title = this.translate.instant('GLOBAL.PROFESSIONAL_LEVEL');
  }

  /**
   * Dirige vers la page d'accueil
   */
  goToHomePage() {
    this.navCtrl.popToRoot();
  }

  /**
   * Dirige vers la page de visualisation des objectifs
   */
  goToCareerObjectiveList() {
    this.navCtrl.push(CareerObjectiveListPage, { matricule: this.pnc.matricule });

  }

  eventTest(event) {
    this.initTabObject();
    console.log('event', event.root.name);
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
    this.navCtrl.push(UpcomingFlightListPage, { matricule: this.pnc.matricule });
  }

  /**
  * Dirige vers l'effectif PNC
  */
  goToPncSearch() {
    this.navCtrl.push(PncSearchPage);
  }

  /**
   * Dirige vers la fiche synthèse
   */
  goToSummarySheet() {
    this.navCtrl.push(SummarySheetPage, { matricule: this.pnc.matricule });
  }

  /**
   * Dirige vers l'attestation réglementaire
   */
  goToStatutoryCertificate() {
    this.navCtrl.push(StatutoryCertificatePage, { matricule: this.pnc.matricule });
  }

  /**
   * Dirige vers le suivi réglementaire
   */
  goToProfessionalLevel() {
    this.navCtrl.push(ProfessionalLevelPage);
  }

}
