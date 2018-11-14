import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, Tabs } from 'ionic-angular';

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
import { SessionService } from '../../services/session.service';
import { SecurityProvider } from '../../providers/security/security';
import { TabNavService } from './../../services/tab-nav/tab-nav.service';
import { tabNavEnum } from '../../shared/enum/tab-nav.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.html'
})
export class TabNavComponent {

  @Input() navCtrl: Nav;

  _matricule: string;

  @ViewChild('tabs') tabs: Tabs;
  pnc: Pnc;

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
    private sessionService: SessionService,
    public securityProvider: SecurityProvider
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      if (this.sessionService.getActiveUser()) {
        this.pncProvider.getPnc(this.sessionService.getActiveUser().matricule).then(pnc => {
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
    });

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
        id: tabNavEnum.CAREER_OBJECTIVE_LIST_PAGE,
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
        display: true
      },
      {
        id: tabNavEnum.STATUTORY_CERTIFICATE_PAGE,
        title: this.translate.instant('GLOBAL.STATUTORY_CERTIFICATE'),
        page: StatutoryCertificatePage,
        icon: 'edospnc-statutoryCertificate',
        params: this.matriculeParams,
        display: !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE')
      },
      {
        id: tabNavEnum.PROFESSIONAL_LEVEL_PAGE,
        title: this.translate.instant('GLOBAL.PROFESSIONAL_LEVEL'),
        page: ProfessionalLevelPage,
        icon: 'md-briefcase',
        params: '',
        display: true
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
}
