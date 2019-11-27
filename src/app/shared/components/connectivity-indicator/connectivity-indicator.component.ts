import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../core/services/device/device.service';
import {
    SynchronizationManagementService
} from '../../../core/services/synchronization/synchronization-management.service';

@Component({
  selector: 'connectivity-indicator',
  templateUrl: 'connectivity-indicator.component.html',
  styleUrls: ['./connectivity-indicator.component.scss']
})
export class ConnectivityIndicatorComponent {

  connected: boolean;

  synchroErrorCount = 0;
  synchroProgress = 0;

  constructor(
    private connectivityService: ConnectivityService,
    private synchronizationManagementService: SynchronizationManagementService,
    public deviceService: DeviceService,
    private router: Router) {
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
    this.router.navigate(['synchronization-management']);
  }

}
