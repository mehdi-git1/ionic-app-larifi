import { Relay } from './../../models/relay';
import { OfflineIndicatorComponent } from './../offline-indicator/offline-indicator';
import { Pnc } from './../../models/pnc';
import { Component, Input, ViewChild } from '@angular/core';
import { CrewMember } from '../../models/crewMember';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { GenderProvider } from './../../providers/gender/gender';
import { PncProvider } from './../../providers/pnc/pnc';
import { NavController } from 'ionic-angular';
import { PncHomePage } from './../../pages/pnc-home/pnc-home';

@Component({
  selector: 'pnc-card',
  templateUrl: 'pnc-card.html'
})
export class PncCardComponent {

  private crewMember: CrewMember;
  @Input() isCrewMember: boolean;
  @Input() disabled: boolean;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    public navCtrl: NavController,
    private genderProvider: GenderProvider,
    public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationProvider,
    private toastProvider: ToastProvider,
    private translate: TranslateService,
    private pncProvider: PncProvider) {
  }

  @Input()
  set itemMember(val: any) {
    this.crewMember = val;
    this.crewMember.pnc.relays.sort((relay: Relay, otherRelay: Relay) => {
      return relay.code > otherRelay.code ? 1 : -1;
    });
  }

  /**
   * Précharge le eDossier du PNC
   */
  downloadPncEdossier(matricule) {
    this.synchroInProgress = true;
    this.synchronizationProvider.storeEDossierOffline(matricule).then(success => {
      this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
      this.synchroInProgress = false;
      this.toastProvider.info(this.translate.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': matricule }));
    }, error => {
      this.toastProvider.error(this.translate.instant('PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }));
      this.synchroInProgress = false;
    });
  }

  getAvatarPicture(gender) {
    return this.genderProvider.getAvatarPicture(gender);
  }
}
