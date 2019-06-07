import { TabNavModeEnum } from './../../../core/enums/tab-nav-mode.enum';
import { TabNavService } from './../../../core/services/tab-nav/tab-nav.service';
import { Component, Input, OnInit } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { SessionService } from '../../../core/services/session/session.service';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html'
})
export class TabNavComponent {

  @Input() mode: TabNavModeEnum = TabNavModeEnum.EDOSSIER;

  tabList: Array<any>;

  TabNavModeEnum = TabNavModeEnum;

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private tabNavService: TabNavService,
    private sessionService: SessionService
  ) {
    this.initTabNav();

    this.events.subscribe('user:authenticationDone', () => {
      this.initTabNav();
    });
  }

  /**
   * Initialise les onglets
   */
  initTabNav() {
    this.tabList = this.tabNavService.getTabList(this.mode);
  }

  /**
   * Ouvre l'onglet indiqué en paramètre
   * @param tab l'onglet vers lequel naviguer
   */
  openTab(tab: any) {
    this.tabNavService.setActiveTab(this.mode, tab);
    let navParams = {};
    if (this.mode === TabNavModeEnum.EDOSSIER && !this.sessionService.isActiveUser(this.sessionService.visitedPnc)) {
      navParams = { matricule: this.sessionService.visitedPnc.matricule };
    }
    this.navCtrl.setRoot(tab.component, navParams);
  }

  /**
   * Teste si l'onglet en paramètre est actif
   * @param tab l'onglet à tester
   * @return vrai s'il s'agit de l'onglet actif, faux sinon
   */
  isActive(tab: any): boolean {
    return this.tabNavService.isActiveTab(this.mode, tab);
  }

  /**
   * Retour à la page d'accueil
   */
  goToHome() {
    this.navCtrl.setRoot(PncHomePage);
  }

}
