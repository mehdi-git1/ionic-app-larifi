import { ProfessionalLevelPage } from './../../../modules/professional-level/pages/professional-level/professional-level.page';
import { PncModel } from './../../../core/models/pnc.model';
import { CareerObjectiveListPage } from './../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { PncService } from './../../../core/services/pnc/pnc.service';
import { Component, Input, ViewChild } from '@angular/core';
import { Nav, Events, LoadingController, Tabs } from 'ionic-angular';

import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';
import { TabNavEnum } from '../../../core/enums/tab-nav.enum';
import { AuthenticationPage } from '../../../modules/home/pages/authentication/authentication.page';
import { SessionService } from '../../../core/services/session/session.service';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @ViewChild('tabs') tabs: Tabs;

  @Input() navCtrl: Nav;

  tabList: Array<any>;

  loading = true;

  initVisitedPnc: PncModel;

  constructor(
    private events: Events,
    private tabNavService: TabNavService,
    private sessionService: SessionService,
    private pncService: PncService,
    private loadingCtrl: LoadingController
  ) {

    // Gère la visite d'un eDossier
    this.handleEdossierVisit();

    this.events.subscribe('user:authenticationDone', () => {
      this.tabList = this.tabNavService.getTabList();
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
   * Permet la gestion du changement d'onglet
   * @param event evenement déclencheur de la fonction
   */
  tabChange(event) {
    // Dans le cas où une visite d'eDossier a été demandée, on attend que le changement d'onglet ait été fait pour charger la page racine correctement
    if (this.initVisitedPnc) {
      this.tabs.getSelected().setRoot(this.initVisitedPnc.manager ? ProfessionalLevelPage : CareerObjectiveListPage, { matricule: this.initVisitedPnc.matricule });
      this.initVisitedPnc = undefined;
    }

    this.events.publish('changeTab', { pageName: event.root.name, pageParams: event.rootParams });
  }

  /**
   * Vérifie si la navigation par onglet est disponible. Celle ci est dispo uniquement pour les cadres
   * @return vrai si la navigation par onglet est disponible, faux sinon
   */
  isTabNavAvailable(): boolean {
    return !this.loading && this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isManager;
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

          this.tabNavService.addEDossierTab(pnc);
          this.tabList = this.tabNavService.getTabList();
          this.tabs.select(this.tabNavService.getTabIndex(pnc.manager ? TabNavEnum.VISITED_MANAGER : TabNavEnum.VISITED_PNC));
          this.initVisitedPnc = pnc;
        });
      }
    });
  }

}
