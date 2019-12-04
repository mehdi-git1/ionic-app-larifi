import { ActivityTabEnum } from './../../../../core/enums/activity/activity-tab.enum';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { HtmlService } from 'src/app/core/file/html/html.service';
import { AppParameterModel } from 'src/app/core/models/app-parameter.model';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
  selector: 'activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
  matricule: string;
  pnc: PncModel;
  tabHeaderEnum: TabHeaderEnum = TabHeaderEnum.ACTIVITY_PAGE;
  regularityLinks: Array<AppParameterModel>;
  activeTab: ActivityTabEnum = ActivityTabEnum.REGULARITY;
  ActivityTabEnum = ActivityTabEnum;

  constructor(
    private pncService: PncService,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private connectivityService: ConnectivityService,
    private htmlService: HtmlService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(this.matricule).then(
      pnc => {
        this.pnc = pnc;
      }
    );
    this.regularityLinks = this.sessionService.getActiveUser().appInitData.regularityLinks;
  }

  switchActiveTab(tabToActivate: ActivityTabEnum): void {
    this.activeTab = tabToActivate;
  }
  /**
   * Verifie si on est en mode Web
   */
  isBrowser() {
    return this.deviceService.isBrowser();
  }

  /**
   * Vérifie que l'on est en mode connecté
   * @return true si on est en mode connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }

  /**
   * redirige vers un lien
   * extere à l'appli
   *
   * @param externalUrl url destination
   */
  gotoLink(externalUrl: string) {
    if (externalUrl) {
      this.htmlService.displayHTML(externalUrl.replace('%MATRICULE%', this.pnc.matricule));
    }
  }
}
