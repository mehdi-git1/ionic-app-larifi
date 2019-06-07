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
import { AuthorizationService } from '../../../core/services/authorization/authorization.service';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @Input() navCtrl: Nav;

  pnc: PncModel;

  tabList: Array<any>;

  loading = true;

  constructor(
    private events: Events,
    private pncProvider: PncService,
    private tabNavService: TabNavService,
    private translate: TranslateService,
    private sessionService: SessionService,
    public securityService: SecurityService,
    private authorizationService: AuthorizationService,
    private isMyPage: IsMyPage,
    private translateService: TranslateService
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      if (this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isPnc) {
        this.pncProvider.getPnc(this.sessionService.getActiveUser().matricule).then(pnc => {
          this.pnc = pnc;
          if (!this.tabList) {
            this.tabList = this.getTabList();
          }
          this.tabNavService.setTabList(this.tabList);

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
    * Récupère la liste des onglets à afficher dans le menu de navigation
    * @return la liste des onglets du menu de navigation
    */
  getTabList(): Array<any> {
    return [
      {
        id: TabNavEnum.PNC_HOME_PAGE,
        title: this.translateService.instant('PNC_HOME.TITLE'),
        page: PncHomePage,
        icon: 'edospnc-home',
        available: true
      },
      {
        id: TabNavEnum.PNC_SEARCH_PAGE,
        title: this.translateService.instant('GLOBAL.MY_PNC_TEAM'),
        page: PncSearchPage,
        icon: 'edospnc-pncTeam',
        available: this.securityService.isManager()
      },
      {
        id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        title: this.translateService.instant('GLOBAL.MY_UPCOMING_FLIGHT'),
        page: UpcomingFlightListPage,
        icon: 'edospnc-upcomingFlight',
        available: this.securityService.isManager()
      },
      {
        id: TabNavEnum.HELP_ASSET_LIST_PAGE,
        title: this.translateService.instant('GLOBAL.MY_HELP_CENTER'),
        page: HelpAssetListPage,
        icon: 'edospnc-helpCenter',
        available: true
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
