import { Component, Input, AfterViewInit } from '@angular/core';
import { CrewMember } from '../../models/CrewMember';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { GenderProvider } from './../../providers/gender/gender';
import { PncProvider } from './../../providers/pnc/pnc';
import { NavController } from 'ionic-angular';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';
/**
 * Generated class for the PncCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pnc-card',
  templateUrl: 'pnc-card.html'
})
export class PncCardComponent implements AfterViewInit {

  @Input() crewMember: CrewMember;
  synchroInProgress: boolean;

  constructor(
    public navCtrl: NavController,
    private genderProvider: GenderProvider,
    public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationProvider,
    private toastProvider: ToastProvider,
    private translate: TranslateService,
    private pncProvider: PncProvider) {
  }

  ngAfterViewInit() {
    this.loadOfflinePncData(this.crewMember.pnc.matricule);
  }

  /**
   * charge les données offline du pnc afin de savoir si il est chargé en cache
   */
  loadOfflinePncData(matricule): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.crewMember.pnc.matricule !== undefined) {
        this.pncProvider.getPnc(this.crewMember.pnc.matricule).then(foundPnc => {
          this.crewMember.pnc = foundPnc;
          resolve();
        }, error => {
          reject();
        });
      }
    });
  }

  /**
   * Précharge le eDossier du PNC
   */
  downloadPncEdossier(event: Event, matricule) {
    event.stopPropagation();
    this.synchroInProgress = true;
    this.synchronizationProvider.storeEDossierOffline(matricule).then(success => {
      this.toastProvider.info(this.translate.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': matricule }));
      this.synchroInProgress = false;
    }, error => {
      this.toastProvider.error(this.translate.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }));
      this.synchroInProgress = false;
    });
  }

  openPncHomePage(matricule) {
    this.navCtrl.push(PncHomePage, { matricule: matricule });
  }

}
