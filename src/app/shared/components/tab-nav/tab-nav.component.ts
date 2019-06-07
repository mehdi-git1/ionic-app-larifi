import { Component, Input } from '@angular/core';
import { Nav, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { UpcomingFlightListPage } from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import { HelpAssetListPage } from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { SecurityService } from '../../../core/services/security/security.service';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import { TabNavEnum } from '../../../core/enums/tab-nav.enum';
import { AuthenticationPage } from '../../../modules/home/pages/authentication/authentication.page';
import { SessionService } from '../../../core/services/session/session.service';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @Input() navCtrl: Nav;

  tabList: Array<any>;

  loading = true;

  constructor(
    private events: Events,
    private tabNavService: TabNavService,
    public securityService: SecurityService,
    private translateService: TranslateService,
    private sessionService: SessionService
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      this.tabList = this.getTabList();
      this.tabNavService.setTabList(this.tabList);
      this.loading = false;

      if (this.navCtrl.canGoBack()) {
        this.navCtrl.popToRoot();
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

  /**
   * Vérifie si la navigation par onglet est disponible. Celle ci est dispo uniquement pour les cadres
   * @return vrai si la navigation par onglet est disponible, faux sinon
   */
  isTabNavAvailable(): boolean {
    return !this.loading && this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isManager;
  }

}
