import { ProfessionalLevelPage } from './../../pages/professional-level/professional-level';
import { StatutoryCertificatePage } from './../../pages/statutory-certificate/statutory-certificate';
import { HelpAssetListPage } from './../../pages/help-asset-list/help-asset-list';
import { UpcomingFlightListPage } from './../../pages/upcoming-flight-list/upcoming-flight-list';
import { PncSearchPage } from './../../pages/pnc-search/pnc-search';
import { SummarySheetPage } from './../../pages/summary-sheet/summary-sheet';
import { CareerObjectiveListPage } from './../../pages/career-objective-list/career-objective-list';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';
import { TabNavService } from './../../providers/tab-nav/tab-nav.service';
import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, Tabs } from 'ionic-angular';

import { Pnc } from './../../models/pnc';
import { Speciality } from './../../models/speciality';

import { PncProvider } from './../../providers/pnc/pnc';
import { tabNavEnum } from '../../shared/enum/tab-nav.enum';
import { TranslateService } from '@ngx-translate/core';
import { SecurityProvider } from '../../providers/security/security';

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
        this.tabsNav = this.createListOfTab();
        this.tabNavService.setListOfTabs(this.tabsNav);
        this.loading = false;
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
  tabsNav;

  loading = true;

  constructor(
    private events: Events,
    private pncProvider: PncProvider,
    private tabNavService: TabNavService,
    private translate: TranslateService,
    private securityProvider: SecurityProvider
  ) {
    this.events.subscribe('changeTab', (data) => {
      // Pour l'instant, rien n'est fait dans ce subscribe car cela est juste une analyse
    });
  }



  /**
   * initialisation des navTab
   */
  createListOfTab() {
    return [
      {
        id: tabNavEnum.PNC_HOME_PAGE,
        title: this.translate.instant('PNC_HOME.TITLE'),
        page: PncHomePage,
        icon: 'edospnc-home',
        params: this.matriculeParams,
        display: true
      },
      {
        id: tabNavEnum.CARRER_OBJECTIVE_LIST_PAGE,
        title: this.translate.instant('GLOBAL.DEVELOPMENT_PROGRAM'),
        page: CareerObjectiveListPage,
        icon: 'edospnc-developmentProgram',
        params: this.matriculeParams,
        display: !this.securityProvider.isManager()
      },
      {
        id: tabNavEnum.SUMMARY_SHEET_PAGE,
        title: this.translate.instant('GLOBAL.PNC_SUMMARY_SHEET'),
        page: SummarySheetPage,
        icon: 'edospnc-summarySheet',
        params: this.matriculeParams,
        display: !this.securityProvider.isManager()
      },
      {
        id: tabNavEnum.PNC_SEARCH_PAGE,
        title: this.translate.instant('GLOBAL.PNC_TEAM'),
        page: PncSearchPage,
        icon: 'edospnc-pncTeam',
        params: '',
        display: this.securityProvider.isManager()
      },
      {
        id: tabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        title: this.translate.instant('GLOBAL.UPCOMING_FLIGHT'),
        page: UpcomingFlightListPage,
        icon: 'edospnc-upcomingFlight',
        params: '',
        display: this.securityProvider.isManager()
      },
      {
        id: tabNavEnum.HELP_ASSET_LIST_PAGE,
        title: this.translate.instant('GLOBAL.HELP_CENTER'),
        page: HelpAssetListPage,
        icon: 'edospnc-helpCenter',
        params: this.roleParams,
        display: this.securityProvider.isManager()
      },
      {
        id: tabNavEnum.STATUTORY_CERTIFICATE_PAGE,
        title: this.translate.instant('GLOBAL.STATUTORY_CERTIFICATE'),
        page: StatutoryCertificatePage,
        icon: 'edospnc-statutoryCertificate',
        params: this.matriculeParams,
        display: true
      },
      {
        id: tabNavEnum.PROFESSIONAL_LEVEL_PAGE,
        title: this.translate.instant('GLOBAL.PROFESSIONAL_LEVEL'),
        page: ProfessionalLevelPage,
        icon: 'md-briefcase',
        params: '',
        display: !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE')
      }
    ];
  }

  /**
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

  /**
   * Permet la navigation dans la nav à partir des autres pages
   */

}
