import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Events, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { TabNavEnum } from '../../../core/enums/tab-nav.enum';
import { PncModel } from '../../../core/models/pnc.model';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../core/services/security/security.service';
import { SessionService } from '../../../core/services/session/session.service';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import {
    CareerObjectiveListPage
} from '../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import {
    UpcomingFlightListPage
} from '../../../modules/flight-activity/pages/upcoming-flight-list/upcoming-flight-list.page';
import {
    HelpAssetListPage
} from '../../../modules/help-asset/pages/help-asset-list/help-asset-list.page';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { PncSearchPage } from '../../../modules/pnc-team/pages/pnc-search/pnc-search.page';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent {

  tabsNav;

  loading = true;

  @ViewChild('tabs', { static: false }) tabs;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      this.tabNavService.setListOfTabs(this.tabsNav);
      this.updateTabs();

      this.loading = false;
    });

    this.events.subscribe('user:authenticationLogout', () => {
      this.router.navigate(['authentication']);
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
        page: this.sessionService.getActiveUser().isManager ? PncHomePage : CareerObjectiveListPage,
        icon: 'md-home',
        route: 'home'
      },
      {
        id: TabNavEnum.PNC_SEARCH_PAGE,
        page: PncSearchPage,
        icon: 'md-contacts',
        route: 'search'
      },
      {
        id: TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE,
        page: UpcomingFlightListPage,
        icon: 'md-jet',
        route: 'flight'
      },
      {
        id: TabNavEnum.VISITED_PNC,
        page: CareerObjectiveListPage,
        icon: 'md-person',
        route: 'visit'
      },
      {
        id: TabNavEnum.HELP_ASSET_LIST_PAGE,
        page: HelpAssetListPage,
        icon: 'md-help-circle',
        route: 'help'
      }
    ];
  }

  /**
   * Met à jour toutes les propriétés des onglets
   */
  updateTabs() {
    this.updatePermissions();
    this.updateTexts();
  }

  /**
   * Met à jour les permissions de façon dynamique
   */
  updatePermissions() {
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_HOME_PAGE)].display = true;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_SEARCH_PAGE)].display = this.securityService.isManager();
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].display = this.securityService.isManager();
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].display = false;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE)].display = this.securityService.isManager();
  }

  /**
   * Met à jour les textes affichés de façon dynamique
   */
  updateTexts() {
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_HOME_PAGE)].title = this.translate.instant('PNC_HOME.MY_TITLE');
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.PNC_SEARCH_PAGE)].title = this.translate.instant('GLOBAL.MY_PNC_TEAM');
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.UPCOMING_FLIGHT_LIST_PAGE)].title =
      this.translate.instant('GLOBAL.MY_UPCOMING_FLIGHT');
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].title = ' ';
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.HELP_ASSET_LIST_PAGE)].title = this.translate.instant('GLOBAL.MY_HELP_CENTER');
  }

  /**
   * Permet la gestion du changement d'onglet
   */
  tabChange(event: any) {
    this.tabNavService.setActiveTab(event.tab);

    this.events.publish('tabChange');
  }

  /**
   * Il est impossible de gérer ce traitement dans un service (problème d'injection inconnu). On gère donc cela avec un système d'events..
   */
  handleEdossierVisit(): void {
    this.events.subscribe('EDossier:visited', (pnc) => {
      if (this.sessionService.isActiveUser(pnc)) {
        this.sessionService.visitedPnc = undefined;
        this.tabs.select(this.tabNavService.getTab(TabNavEnum.PNC_HOME_PAGE).route);
      } else {
        this.loadingCtrl.create().then(loading => {
          loading.present();

          this.pncService.getPnc(pnc.matricule).then(pncFound => {
            loading.dismiss();
            this.sessionService.visitedPnc = pncFound;

            this.addEDossierTab(pnc);
            if (pnc.manager) {
              this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'professional-level']);
            } else {
              this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, 'career-objective']);
            }
          });
        });
      }
    });
  }

  /**
   * Ajoute à la tabNav une entrée vers le dossier d'un PNC
   * @param pnc le pnc à ajouter à la tabNav
   */
  addEDossierTab(pnc: PncModel) {
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].title = `${pnc.firstName} ${pnc.lastName}`;
    this.tabsNav[this.tabNavService.getTabIndex(TabNavEnum.VISITED_PNC)].display = true;
  }

  /**
   * Vérifie si la navigation par onglet est disponible. Celle ci est dispo uniquement pour les cadres
   * @return vrai si la navigation par onglet est disponible, faux sinon
   */
  isAvailable(): boolean {
    return this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isManager;
  }
}
