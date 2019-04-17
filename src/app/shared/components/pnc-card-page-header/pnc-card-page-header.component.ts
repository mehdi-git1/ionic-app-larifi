import { RelayModel } from '../../../core/models/statutory-certificate/relay.model';
import { PncModel } from '../../../core/models/pnc.model';
import { Component, Input, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { SynchronizationService } from '../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator.component';


@Component({
  selector: 'pnc-card-page-header',
  templateUrl: 'pnc-card-page-header.component.html'
})
export class PncCardPageHeaderComponent {

  private pnc: PncModel;
  formatedSpeciality: string;
  @Input() isCrewMember: boolean;
  @Input() disabled: boolean;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    public navCtrl: NavController,
    public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationService,
    private toastProvider: ToastService,
    private translate: TranslateService,
    private pncProvider: PncService) {
  }

  @Input()
  set itemMember(val: any) {
    if (this.isCrewMember) {
      this.pnc = val.pnc;
    } else {
      this.pnc = val;
    }
    if (this.pnc.relays) {
      this.pnc.relays.sort((relay: RelayModel, otherRelay: RelayModel) => {
        return relay.code > otherRelay.code ? 1 : -1;
      });
    }
    this.formatedSpeciality = this.pncProvider.getFormatedSpeciality(this.pnc);
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

}
