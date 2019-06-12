import { PncService } from './../../../core/services/pnc/pnc.service';
import { Component, Input } from '@angular/core';
import { Nav, Events, LoadingController } from 'ionic-angular';

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
    this.events.subscribe('EDossier:visited', (pnc, navCtrl) => {
      if (this.sessionService.isActiveUser(pnc)) {
        this.sessionService.visitedPnc = undefined;
        navCtrl.parent.select(this.tabNavService.getTabIndex(TabNavEnum.PNC_HOME_PAGE));
      } else {
        const loading = this.loadingCtrl.create();
        loading.present();
        this.pncService.getPnc(pnc.matricule).then(pncFound => {
          loading.dismiss();
          this.sessionService.visitedPnc = pncFound;

          this.tabNavService.addEDossierTab(pnc);
          this.tabList = this.tabNavService.getTabList();
          navCtrl.parent.select(this.tabNavService.getTabIndex(pnc.manager ? TabNavEnum.VISITED_MANAGER : TabNavEnum.VISITED_PNC));
        });
      }
    });
  }

}
