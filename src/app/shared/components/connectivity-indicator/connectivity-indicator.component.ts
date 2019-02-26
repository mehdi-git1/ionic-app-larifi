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

  constructor(private connectivityService: ConnectivityService,
    private synchronizationManagementService: SynchronizationManagementService,
    public deviceService: DeviceService,
    private navCtrl: NavController) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });
  }

  getSynchroProgress(): number {
    return this.synchronizationManagementService.getProgress();
  }

  synchroInProgress(): boolean {
    return (this.getSynchroProgress() > 0 && this.getSynchroProgress() < 100);
  }

  goToSynchronizationManagementPage(): void {
    this.navCtrl.push(SynchronizationManagementPage);
  }

}
