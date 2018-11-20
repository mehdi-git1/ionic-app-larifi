import { Component, Input, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { CrewMemberEnum } from '../../../core/models/crew-member.enum';
import { SynchronizationService } from '../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { GenderService } from '../../../core/services/gender/gender.service';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { RelayModel } from '../../../core/models/relay.model';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator.component';


@Component({
  selector: 'pnc-card',
  templateUrl: 'pnc-card.component.html'
})
export class PncCardComponent {

  private crewMember: CrewMemberEnum;
  formatedSpeciality: string;
  @Input() isCrewMember: boolean;
  @Input() disabled: boolean;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    public navCtrl: NavController,
    private genderProvider: GenderService,
    public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationService,
    private toastProvider: ToastService,
    private translate: TranslateService,
    private pncProvider: PncService) {
  }

  @Input()
  set itemMember(val: any) {
    this.crewMember = val;
    this.formatedSpeciality = this.pncProvider.getFormatedSpeciality(this.crewMember.pnc);
    this.crewMember.pnc.relays.sort((relay: RelayModel, otherRelay: RelayModel) => {
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
