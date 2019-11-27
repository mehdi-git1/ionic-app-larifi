import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PncModel } from '../../../core/models/pnc.model';
import { RelayModel } from '../../../core/models/statutory-certificate/relay.model';
import { PncService } from '../../../core/services/pnc/pnc.service';
import {
    SynchronizationService
} from '../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator.component';

@Component({
  selector: 'pnc-header',
  templateUrl: 'pnc-header.component.html',
  styleUrls: ['./pnc-header.component.scss']
})
export class PncHeaderComponent implements OnChanges {

  @Input() pnc: PncModel;
  formatedSpeciality: string;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent, { static: false })
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    private synchronizationService: SynchronizationService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private pncService: PncService) {
  }

  ngOnChanges() {
    if (this.pnc && this.pnc.relays) {
      this.pnc.relays.sort((relay: RelayModel, otherRelay: RelayModel) => {
        return relay.code > otherRelay.code ? 1 : -1;
      });
    }
  }

  /**
   * Récupère les relais formatés pour l'affichage
   */
  getFormatedSpeciality(): string {
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

  /**
   * Renvoi la string à afficher en fonction de la valeur du TAF
   */
  getTafValue(): string {
    return this.pnc.taf ? 'Oui' : 'Non';
  }
}
