import { Events, LoadingController, Nav, Tabs } from 'ionic-angular';

import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PncRoleEnum } from '../../../core/enums/pnc-role.enum';
import { TabNavEnum } from '../../../core/enums/tab-nav.enum';
import { PncModel } from '../../../core/models/pnc.model';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../core/services/security/security.service';
import { SessionService } from '../../../core/services/session/session.service';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import {
    DevelopmentProgramPage
} from '../../../modules/development-program/pages/development-program/development-program.page';
import {
    UpcomingFlightListPage
} from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import {
    HelpAssetListPage
} from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { AuthenticationPage } from '../../../modules/home/pages/authentication/authentication.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';
import {
    ProfessionalLevelPage
} from '../../../modules/professional-level/pages/professional-level/professional-level.page';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @Input() navCtrl: Nav;

  @ViewChild('tabs') tabs: Tabs;

  tabsNav;

  loading = true;

  initVisitedPnc: PncModel;

  rootParams;

  constructor(
    private events: Events,
    private pncService: PncService,
    private tabNavService: TabNavService,
    private translate: TranslateService,
    private sessionService: SessionService,
    private securityService: SecurityService,
    private loadingCtrl: LoadingController
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      if (!this.tabsNav) {
        this.tabsNav = this.createListOfTab();
      }
      // Initialise le matricule de la la personne connectée
      this.updateRootParams();
      this.tabNavService.setListOfTabs(this.tabsNav);
      this.updateTexts();
      this.updatePermissions();

      this.loading = false;
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.popToRoot();
      }
    });

    this.events.subscribe('user:authenticationLogout', () => {
      this.navCtrl.setRoot(AuthenticationPage);
      this.loading = true;
    });

    // Gère la visite d'un eDossier
    this.handleEdossierVisit();
  }

  /**
   * initialisation des navTab
   */
  createListOfTab() {
    return [
      {
        id: TabNavEnum.PNC_HOME_PAGE,
        page: this.sessionService.getActiveUser().isManager ? PncHomePage : DevelopmentProgramPage,
        icon: 'md-home',
      },
      {
        id: TabNavEnum.PNC_SEARCH_PAGE,
        page: PncSearchPage,
        icon: 'md-contacts',
      },
      {
        id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        page: UpcomingFlightListPage,
        icon: 'md-jet',
      },
      {
        id: TabNavEnum.VISITED_PNC,
        page: DevelopmentProgramPage,
        icon: 'md-person'
      },
      {
        id: TabNavEnum.VISITED_MANAGER,
        page: ProfessionalLevelPage,
        icon: 'md-person'
      },
      {
        id: TabNavEnum.HELP_ASSET_LIST_PAGE,
        page: HelpAssetListPage,
        icon: 'md-help-circle'
      }
    ];
  }

  /**
   * Met à jour les permissions de façon dynamique
   */
  updatePermissions() {
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_HOME_PAGE)].display = true;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_SEARCH_PAGE)].display = this.securityService.isManager();
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].display = this.securityService.isManager();
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].display = false;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_MANAGER)].display = false;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE)].display = this.securityService.isManager();
  }

  /**
 * Met à jour les textes affichés de façon dynamique
 */
  updateTexts() {
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_HOME_PAGE)].title = this.translate.instant('PNC_HOME.MY_TITLE');
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_SEARCH_PAGE)].title = this.translate.instant('GLOBAL.MY_PNC_TEAM');
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].title = this.translate.instant('GLOBAL.MY_UPCOMING_FLIGHT');
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].title = ' ';
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_MANAGER)].title = ' ';
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE)].title = this.translate.instant('GLOBAL.MY_HELP_CENTER');
  }

  /**
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    // Dans le cas où une visite d'eDossier a été demandée, on attend que le changement d'onglet ait été fait pour charger la page racine correctement
    if (this.initVisitedPnc) {
      this.tabs.getSelected().setRoot(this.initVisitedPnc.manager ? ProfessionalLevelPage : DevelopmentProgramPage, { matricule: this.initVisitedPnc.matricule });
      this.initVisitedPnc = undefined;
    }

    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

  /**
   * Il est impossible de gérer ce traitement dans un service (problème d'injection inconnu). On gère donc cela avec un système d'events..
   */
  handleEdossierVisit(): void {
    this.events.subscribe('EDossier:visited', (pnc) => {
      if (this.sessionService.isActiveUser(pnc)) {
        this.sessionService.visitedPnc = undefined;
        this.tabs.select(this.tabNavService.getTabIndex(TabNavEnum.PNC_HOME_PAGE));
      } else {
        const loading = this.loadingCtrl.create();
        loading.present();
        this.pncService.getPnc(pnc.matricule).then(pncFound => {
          loading.dismiss();
          this.sessionService.visitedPnc = pncFound;

          this.addEDossierTab(pnc);
          this.tabs.select(this.tabNavService.getTabIndex(pnc.manager ? TabNavEnum.VISITED_MANAGER : TabNavEnum.VISITED_PNC));
          this.initVisitedPnc = pnc;
        });
      }
    });
  }

  /**
    * Ajoute à la tabNav une entrée vers le dossier d'un PNC et redirige vers cette entrée
    * @param pnc le pnc à ajouter à la tabNav
    */
  addEDossierTab(pnc: PncModel) {
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_MANAGER)].display = false;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].display = false;

    if (pnc.manager) {
      this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_MANAGER)].title = `${pnc.firstName} ${pnc.lastName}`;
      this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_MANAGER)].display = true;
    } else {
      this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].title = `${pnc.firstName} ${pnc.lastName}`;
      this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].display = true;
    }
  }

  /**
   * Vérifie si la navigation par onglet est disponible. Celle ci est dispo uniquement pour les cadres
   * @return vrai si la navigation par onglet est disponible, faux sinon
   */
  isAvailable(): boolean {
    return this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isManager;
  }

  /**
   * Met à jour les paramètres de navigation à transmettre à la page racine
   */
  updateRootParams() {
    this.rootParams = {
      matricule: this.sessionService.getActiveUser().matricule,
      pncRole: this.sessionService.getActiveUser().isManager ? PncRoleEnum.MANAGER : PncRoleEnum.PNC
    };
  }

}
