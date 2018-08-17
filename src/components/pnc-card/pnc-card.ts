import { Pnc } from './../../models/pnc';
import { PncTransformerProvider } from './../../providers/pnc/pnc-transformer';
import { Component, Input } from '@angular/core';
import { CrewMember } from '../../models/crewMember';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
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
  synchroInProgress: boolean;

  constructor(
    public navCtrl: NavController,
    private genderProvider: GenderProvider,
    public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationProvider,
    private toastProvider: ToastProvider,
    private translate: TranslateService,
    private pncProvider: PncProvider,
    private pncTransformer: PncTransformerProvider) {
  }

  @Input()
  set itemMember(val: any) {
    if (val && val.pnc && !(val.pnc instanceof Pnc)) {
      const pnc: Pnc = this.pncTransformer.toPnc(val.pnc);
      val.pnc = pnc;
    }
    this.crewMember = val;
  }

  /**
   * Précharge le eDossier du PNC
   */
  downloadPncEdossier(matricule) {
    this.synchroInProgress = true;
    this.synchronizationProvider.storeEDossierOffline(matricule).then(success => {
      this.pncProvider.refreshOfflineStorageDate(this.crewMember.pnc);
      this.synchroInProgress = false;
      this.toastProvider.info(this.translate.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { 'matricule': matricule }));
    }, error => {
      this.toastProvider.error(this.translate.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { 'matricule': matricule }));
      this.synchroInProgress = false;
    });
  }

  getAvatarPicture(gender) {
    return this.genderProvider.getAvatarPicture(gender);
  }
}
