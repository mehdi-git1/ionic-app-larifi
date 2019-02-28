import { NavController } from 'ionic-angular';
import { DeviceService } from './../../../core/services/device/device.service';
import { Component } from '@angular/core';

import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { SynchronizationManagementPage } from '../../../modules/synchronization/pages/synchronization-management/synchronization-management.page';
import { SynchronizationManagementService } from '../../../core/services/synchronization/synchronization-management.service';

@Component({
  selector: 'connectivity-indicator',
  templateUrl: 'connectivity-indicator.component.html'
})
export class ConnectivityIndicatorComponent {

  connected: boolean;

  synchroErrorCount = 0;
  synchroProgress = 0;

  constructor(private connectivityService: ConnectivityService,
    private synchronizationManagementService: SynchronizationManagementService,
    public deviceService: DeviceService,
    private navCtrl: NavController) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationManagementService.progressChange.subscribe(synchroProgress => {
      this.synchroProgress = synchroProgress;
    });

    this.synchronizationManagementService.synchroErrorCountChange.subscribe(synchroErrorCount => {
      this.synchroErrorCount = synchroErrorCount;
    });

    this.synchroErrorCount = this.synchronizationManagementService.getSynchroErrorCount();
    this.synchroProgress = this.synchronizationManagementService.getProgress();
  }

  /**
   * Vérifie si une synchronisation est en cours
   * @return vrai si c'est le cas, faux sinon
   */
  synchroInProgress(): boolean {
    return (this.synchroProgress > 0 && this.synchroProgress < 100) && this.connected;
  }

  /**
   * Redirige vers la page de gestion de la synchronisation
   */
  goToSynchronizationManagementPage(): void {
    this.navCtrl.push(SynchronizationManagementPage);
  }

}
