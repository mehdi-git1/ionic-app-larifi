import { StatutoryReporting } from './../../models/statutoryReporting/statutory-reporting';
import { StatutoryReportingProvider } from './../../providers/statutory-reporting/statutory-reporting';
import { PncProvider } from './../../providers/pnc/pnc';
import { SessionService } from './../../services/session.service';
import { Pnc } from './../../models/pnc';
import { Stage } from './../../models/statutoryReporting/stage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-statutory-reporting',
  templateUrl: 'statutory-reporting.html',
})
export class StatutoryReportingPage {

  pnc: Pnc;
  matricule: string;
  statutoryReporting: StatutoryReporting;
  constructor(private navParams: NavParams,
    private sessionService: SessionService,
    private pncProvider: PncProvider,
    private statutoryReportingProvider: StatutoryReportingProvider) {
  }

  ionViewDidEnter() {
    if (this.navParams.get('matricule')) {
      this.matricule = this.navParams.get('matricule');
    } else if (this.sessionService.authenticatedUser) {
      this.matricule = this.sessionService.authenticatedUser.matricule;
    }
    if (this.matricule != null) {
      this.pncProvider.getPnc(this.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });
      this.statutoryReportingProvider.getStatutoryReporting(this.matricule).then(statutoryReporting => {
        this.statutoryReporting = statutoryReporting;
      }, error => { });
    }
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.statutoryReporting !== 'undefined';
  }

}
