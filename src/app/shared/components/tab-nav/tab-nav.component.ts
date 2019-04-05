import { CongratulationLettersPage } from './../../../modules/congratulation-letter/pages/congratulation-letters/congratulation-letters.page';
import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, Tabs } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { PncModel } from '../../../core/models/pnc.model';
import { SpecialityService } from '../../../core/services/speciality/speciality.service';
import { StatutoryCertificatePage } from '../../../modules/statutory-certificate/pages/statutory-certificate/statutory-certificate.page';
import { ProfessionalLevelPage } from '../../../modules/professional-level/pages/professional-level/professional-level.page';
import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { UpcomingFlightListPage } from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { HelpAssetListPage } from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { CareerObjectiveListPage } from '../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../core/services/session/session.service';
import { SecurityService } from '../../../core/services/security/security.service';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import { TabNavEnum } from '../../../core/enums/tab-nav.enum';
import { SpecialityEnum } from '../../../core/enums/speciality.enum';
import { AuthenticationPage } from '../../../modules/home/pages/authentication/authentication.page';
import { IsMyPage } from '../../pipes/is_my_page/is_my_page.pipe';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @Input() navCtrl: Nav;

  _matricule: string;

  @ViewChild('tabs') tabs: Tabs;
  pnc: PncModel;

  // exporter la classe enum speciality dans la page html
  Speciality = SpecialityEnum;

  // Paramètres envoyés aux pages
  pncParams;
  matriculeParams;
  roleParams;
  tabsNav;

  loading = true;

  constructor(
    private events: Events,
    private pncProvider: PncService,
    private tabNavService: TabNavService,
    private translate: TranslateService,
    private sessionService: SessionService,
    public securityProvider: SecurityService,
    private specialityService: SpecialityService,
    private isMyPage: IsMyPage
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      if (this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isPnc) {
        this.pncProvider.getPnc(this.sessionService.getActiveUser().matricule).then(pnc => {
          this.pnc = pnc;
          this.pncParams = this.pnc;
          this.matriculeParams = { matricule: this.pnc.matricule };
          this.roleParams = { pncRole: this.specialityService.getPncRole(this.pnc.speciality) };
          if (!this.tabsNav) {
            this.tabsNav = this.createListOfTab();
          }
          this.tabNavService.setListOfTabs(this.tabsNav);
          this.updateTexts();
          this.updatePermissions();

          this.loading = false;
          this.navCtrl.popToRoot();
        }, error => {
        });
      }
    });

    this.events.subscribe('user:authenticationLogout', () => {
      this.navCtrl.setRoot(AuthenticationPage);
      this.loading = true;
    });
  }

  /**
   * initialisation des navTab
   */
  createListOfTab() {
    return [
      {
        id: TabNavEnum.PNC_HOME_PAGE,
        page: PncHomePage,
        icon: 'edospnc-home',
      },
      {
        id: TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE,
        page: CareerObjectiveListPage,
        icon: 'edospnc-developmentProgram',
      },
      {
        id: TabNavEnum.PNC_SEARCH_PAGE,
        page: PncSearchPage,
        icon: 'edospnc-pncTeam',
      },
      {
        id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        page: UpcomingFlightListPage,
        icon: 'edospnc-upcomingFlight',
      },
      {
        id: TabNavEnum.HELP_ASSET_LIST_PAGE,
        page: HelpAssetListPage,
        icon: 'edospnc-helpCenter'
      },
      {
        id: TabNavEnum.STATUTORY_CERTIFICATE_PAGE,
        page: StatutoryCertificatePage,
        icon: 'edospnc-statutoryCertificate',
      },
      {
        id: TabNavEnum.PROFESSIONAL_LEVEL_PAGE,
        page: ProfessionalLevelPage,
        icon: 'edospnc-professionalLevel',
      },
      {
        id: TabNavEnum.CONGRATULATION_LETTERS_PAGE,
        page: CongratulationLettersPage,
        icon: 'ios-mail',
      }
    ];
  }

  /**
   * Met à jour les permissions de façon dynamique
   */
  updatePermissions() {
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.PNC_HOME_PAGE)].display = true;
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE)].display = !this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.PNC_SEARCH_PAGE)].display = this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].display = this.securityProvider.isManager();
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE)].display = true;
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.STATUTORY_CERTIFICATE_PAGE)].display = !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_STATUTORY_CERTIFICATE');
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.PROFESSIONAL_LEVEL_PAGE)].display = !this.securityProvider.isManager() && this.securityProvider.hasPermissionToViewTab('VIEW_PROFESSIONAL_LEVEL');
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.CONGRATULATION_LETTERS_PAGE)].display = true;
  }

  /**
 * Met à jour les textes affichés de façon dynamique
 */
  updateTexts() {
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.PNC_HOME_PAGE)].title = this.translate.instant(this.isMyPage.transform('PNC_HOME.TITLE', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.CAREER_OBJECTIVE_LIST_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.DEVELOPMENT_PROGRAM', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.PNC_SEARCH_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.PNC_TEAM', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.UPCOMING_FLIGHT', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.HELP_CENTER', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.STATUTORY_CERTIFICATE_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.STATUTORY_CERTIFICATE', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.PROFESSIONAL_LEVEL_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.PROFESSIONAL_LEVEL', this.pnc));
    this.tabsNav[this.tabNavService.findTabIndex(TabNavEnum.CONGRATULATION_LETTERS_PAGE)].title = this.translate.instant(this.isMyPage.transform('GLOBAL.CONGRATULATION_LETTERS', this.pnc));
  }

  /**
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

}
