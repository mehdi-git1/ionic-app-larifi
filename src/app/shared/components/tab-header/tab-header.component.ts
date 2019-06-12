import { TabHeaderModeEnum } from '../../../core/enums/tab-header-mode.enum';
import { Component, Input } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { SessionService } from '../../../core/services/session/session.service';
import { TabHeaderService } from '../../../core/services/tab-header/tab-header.service';

@Component({
  selector: 'tab-header',
  templateUrl: 'tab-header.component.html'
})
export class TabHeaderComponent {

  @Input() mode: TabHeaderModeEnum = TabHeaderModeEnum.EDOSSIER;

  tabList: Array<any>;

  TabNavModeEnum = TabHeaderModeEnum;

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private tabHeaderService: TabHeaderService,
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
    this.tabList = this.tabHeaderService.getTabList(this.mode);
  }

  /**
   * Ouvre l'onglet indiqué en paramètre
   * @param tab l'onglet vers lequel naviguer
   */
  openTab(tab: any) {
    this.tabHeaderService.setActiveTab(this.mode, tab);
    let navParams = {};
    if (this.mode === TabHeaderModeEnum.EDOSSIER && this.sessionService.visitedPnc && !this.sessionService.isActiveUser(this.sessionService.visitedPnc)) {
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
    return this.tabHeaderService.isActiveTab(this.mode, tab);
  }

  /**
   * Retour à la page d'accueil
   */
  goToHome() {
    this.navCtrl.setRoot(PncHomePage);
  }

}
