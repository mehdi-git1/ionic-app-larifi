import { Component, Input } from '@angular/core';
import { CrewMember } from '../../models/CrewMember';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { GenderProvider } from './../../providers/gender/gender';
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
export class PncCardComponent {

  @Input() crewMember: CrewMember;
  synchroInProgress: boolean;

  constructor(
    private genderProvider: GenderProvider,
    public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationProvider,
    private toastProvider: ToastProvider,
    private translate: TranslateService) {
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

}
