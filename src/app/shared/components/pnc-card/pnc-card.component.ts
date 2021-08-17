import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CrewMemberModel } from '../../../core/models/crew-member.model';
import { PncModel } from '../../../core/models/pnc.model';
import { RelayModel } from '../../../core/models/statutory-certificate/relay.model';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../core/services/device/device.service';
import { GenderService } from '../../../core/services/gender/gender.service';
import { PncService } from '../../../core/services/pnc/pnc.service';
import {
  SynchronizationService
} from '../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator.component';

@Component({
  selector: 'pnc-card',
  templateUrl: 'pnc-card.component.html',
  styleUrls: ['./pnc-card.component.scss']
})
export class PncCardComponent {

  crewMember: CrewMemberModel;
  pnc: PncModel;
  formatedSpeciality: string;
  @Output() selectPncAsRecipient = new EventEmitter<PncModel>();
  @Output() unSelectPncAsRecipient = new EventEmitter<PncModel>();

  @Input() isCrewMember: boolean;
  @Input() disabled: boolean;
  @Input() displayCheckmark = false;
  @Input() isSendMailActive = false;
  @Input() isAllSelected = false;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent, { static: false })
  offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    private genderService: GenderService,
    private synchronizationService: SynchronizationService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private connectivityService: ConnectivityService,
    private deviceService: DeviceService,
    private pncService: PncService) {
  }

  @Input()
  set itemMember(val: any) {
    if (this.isCrewMember) {
      this.crewMember = val;
      this.pnc = val.pnc;
    } else {
      this.pnc = val;
    }
    if (this.pnc.relays) {
      this.pnc.relays.sort((relay: RelayModel, otherRelay: RelayModel) => {
        return relay.code > otherRelay.code ? 1 : -1;
      });
    }
    this.formatedSpeciality = this.pncService.getFormatedSpeciality(this.pnc);
  }

  /**
   * Précharge le eDossier du PNC
   */
  downloadPncEdossier(matricule) {
    this.synchroInProgress = true;
    this.synchronizationService.storeEDossierOffline(matricule).then(success => {
      this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
      this.synchroInProgress = false;
      this.toastService.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { matricule: matricule }));
    }, error => {
      this.toastService.error(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { matricule: matricule }));
      this.synchroInProgress = false;
    });
  }

  /**
   * Récupère l'avatar par défaut en fonction d'un genre
   * @param gender le genre
   * @return l'avatar correspondant au genre donné
   */
  getAvatarPicture(gender) {
    return this.genderService.getAvatarPicture(gender);
  }

  /**
   * Détermine si le bouton de mise en cache est disponible
   * @return vrai s'il est dispo, faux sinon
   */
  isDownloadButtonAvailable(): boolean {
    return !this.isSendMailActive && this.connectivityService.isConnected() && this.deviceService.isOfflineModeAvailable();
  }

  showCheckMark(): boolean {
    return this.displayCheckmark || this.isAllSelected;
  }

  /**
   * @param event évènement déclenché depuis le DOM
   * @param pnc le pnc sur lequel on a cliqué la photo
   */
  stopPropagation(event: any, pnc: PncModel): void {
    event.stopPropagation();
    if (this.isSendMailActive) {
      this.displayCheckmark = !this.displayCheckmark;
      if (this.displayCheckmark) {
        this.selectPncAsRecipient.emit(pnc);
      } else {
        this.unSelectPncAsRecipient.emit(pnc);
      }
    }
  }
}
