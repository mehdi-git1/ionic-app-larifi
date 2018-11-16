import { Relay } from '../../../core/models/relay';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator';
import { Pnc } from '../../../core/models/pnc';
import { Component, Input, ViewChild } from '@angular/core';
import { CrewMember } from '../../../core/models/crewMember';
import { SynchronizationProvider } from '../../../core/services/synchronization/synchronization';
import { ToastProvider } from '../../../core/services/toast/toast';
import { ConnectivityService } from '../../../../services/connectivity/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { GenderProvider } from '../../../core/services/gender/gender';
import { PncProvider } from '../../../core/services/pnc/pnc';
import { NavController } from 'ionic-angular';
import { PncHomePage } from '../../../modules/home/pnc-home/pnc-home';

@Component({
  selector: 'pnc-card',
  templateUrl: 'pnc-card.html'
})
export class PncCardComponent {

  private crewMember: CrewMember;
  formatedSpeciality: string;
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
    this.formatedSpeciality = this.pncProvider.getFormatedSpeciality(this.crewMember.pnc);
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
