import { Component } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';
import { SynchronizationService } from '../../../core/services/synchronization/synchronization.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';

@Component({
  selector: 'connectivity-indicator',
  templateUrl: 'connectivity-indicator.component.html'
})
export class ConnectivityIndicatorComponent {

  connected: boolean;
  synchroInProgress: boolean;

  constructor(public connectivityService: ConnectivityService,
    public synchronizationProvider: SynchronizationService,
    public deviceService: DeviceService) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      this.synchroInProgress = synchroInProgress;
    });
  }

}
