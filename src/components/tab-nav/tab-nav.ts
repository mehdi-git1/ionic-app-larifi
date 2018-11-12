import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, Tabs } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Pnc } from './../../models/pnc';
import { Speciality } from './../../models/speciality';
import { StatutoryCertificatePage } from '../../pages/statutory-certificate/statutory-certificate';
import { ProfessionalLevelPage } from './../../pages/professional-level/professional-level';
import { SummarySheetPage } from './../../pages/summary-sheet/summary-sheet';
import { PncSearchPage } from './../../pages/pnc-search/pnc-search';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';
import { UpcomingFlightListPage } from './../../pages/upcoming-flight-list/upcoming-flight-list';
import { HelpAssetListPage } from './../../pages/help-asset-list/help-asset-list';
import { CareerObjectiveListPage } from './../../pages/career-objective-list/career-objective-list';
import { PncProvider } from './../../providers/pnc/pnc';


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

  // Paramètres envoyés aux pages
  pncParams;
  matriculeParams;
  roleParams;
  tabObject;

  constructor(
    private events: Events,
    private pncProvider: PncProvider,
    private translate: TranslateService) {
    this.initTabObject();
    this.events.subscribe('changeTab', (data) => {
      // Pour l'instant, rien n'est fait dans ce subscribe car cela est juste une analyse
    });
  }

  /**
   * Fonction d'initialisation des titres dynamiquement
   */
  initTabObject() {
    // Création d'un objet tabObject pour pouvoir modifier facilement les libellées des tabs
    this.tabObject = {
      pncHome: { title: this.translate.instant('PNC_HOME.TITLE'), page: PncHomePage },
      careerObjectiveList: { title: this.translate.instant('GLOBAL.DEVELOPMENT_PROGRAM'), page: CareerObjectiveListPage },
      pncSummarySheet: { title: this.translate.instant('GLOBAL.PNC_SUMMARY_SHEET'), page: SummarySheetPage },
      pncSearch: { title: this.translate.instant('GLOBAL.PNC_TEAM'), page: PncSearchPage },
      upcomingFlightList: { title: this.translate.instant('GLOBAL.UPCOMING_FLIGHT'), page: UpcomingFlightListPage },
      helpAssetList: { title: this.translate.instant('GLOBAL.HELP_CENTER'), page: HelpAssetListPage },
      statutoryCertificate: { title: this.translate.instant('GLOBAL.STATUTORY_CERTIFICATE'), page: StatutoryCertificatePage },
      professionalLevel: { title: this.translate.instant('GLOBAL.PROFESSIONAL_LEVEL'), page: ProfessionalLevelPage }
    };
  }

  /**
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    this.initTabObject();
    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

}
