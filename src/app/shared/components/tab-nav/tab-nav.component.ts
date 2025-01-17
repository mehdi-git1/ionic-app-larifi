import { Component, ViewChild } from '@angular/core';

import { Events } from '../../../core/services/events/events.service';
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

  /**
   * Récupère la valeur à afficher pour le badge de notif
   * @param tabNav le tab à traiter
   * @return la valeur du badge à afficher
   */
  getBadgeValue(tabNav: any): string {
    if (tabNav.badgeValue > 9) {
      return '9+';
    }
    return tabNav.badgeValue.toString();
  }
}
