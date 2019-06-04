import { RelayModel } from '../../../core/models/statutory-certificate/relay.model';
import { PncModel } from '../../../core/models/pnc.model';
import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SynchronizationService } from '../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator.component';


@Component({
  selector: 'pnc-card-page-header',
  templateUrl: 'pnc-card-page-header.component.html'
})
export class PncCardPageHeaderComponent {

  pnc: PncModel;
  formatedSpeciality: string;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    private synchronizationService: SynchronizationService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private pncService: PncService) {
  }

  /**
   * Récupère les relais formatés pour l'affichage
   */
  getFormatedSpeciality(): string {
    if (this.pnc.relays) {
      this.pnc.relays.sort((relay: RelayModel, otherRelay: RelayModel) => {
        return relay.code > otherRelay.code ? 1 : -1;
      });
    }
    return this.pncService.getFormatedSpeciality(this.pnc);
  }

  /**
   * Précharge le eDossier du PNC
   */
  downloadPncEdossier(matricule) {
    this.synchroInProgress = true;
    this.synchronizationService.storeEDossierOffline(matricule).then(success => {
      this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
      this.synchroInProgress = false;
      this.toastService.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': matricule }));
    }, error => {
      this.toastService.error(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }));
      this.synchroInProgress = false;
    });
  }

}
