import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';

import { Component, OnInit } from '@angular/core';

import { ActivityTabEnum } from '../../../../core/enums/activity/activity-tab.enum';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
  selector: 'activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  activeTab: ActivityTabEnum = ActivityTabEnum.REGULARITY;
  ActivityTabEnum = ActivityTabEnum;
  TabHeaderEnum = TabHeaderEnum;
  pnc: PncModel;

  constructor(private connectivityService: ConnectivityService) { }

  ngOnInit() {
  }

  switchActiveTab(tabToActivate: ActivityTabEnum): void {
    this.activeTab = tabToActivate;
  }


  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return true;
  }

  /**
   * Vérifie si un onglet est actif
   * @param activityTab le mode (onglet) à tester
   * @return vrai si le mode est actif, faux sinon
   */
  isTabActive(activityTab: ActivityTabEnum): boolean {
    return activityTab === this.activeTab;
  }

  /**
   * Vérifie que l'on est en mode connecté
   * @return true si on est en mode connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }
}
