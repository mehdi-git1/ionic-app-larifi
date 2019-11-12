import { Component, ViewChild } from '@angular/core';
import { Events } from '@ionic/angular';

import { SessionService } from '../../../core/services/session/session.service';
import { TabNavService } from '../../../core/services/tab-nav/tab-nav.service';

@Component({
  selector: 'tab-nav',
  templateUrl: 'tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent {

  tabsNav;

  @ViewChild('tabs', { static: false }) tabs;

  constructor(
    private events: Events,
    private tabNavService: TabNavService,
    private sessionService: SessionService,
  ) {
  }

  /**
   * Récupère la liste des tabs à afficher
   */
  getTabList() {
    return this.tabNavService.tabList;
  }

  /**
   * Permet la gestion du changement d'onglet
   */
  tabChange(event: any) {
    this.tabNavService.setActiveTab(event.tab);

    this.events.publish('tabChange');
  }

  /**
   * Vérifie si la navigation par onglet est disponible. Celle ci est dispo uniquement pour les cadres
   * @return vrai si la navigation par onglet est disponible, faux sinon
   */
  isAvailable(): boolean {
    return this.sessionService.getActiveUser() && this.sessionService.getActiveUser().isManager;
  }
}
