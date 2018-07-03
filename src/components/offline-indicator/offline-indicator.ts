import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { Component } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity.service';

@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  connected: boolean;
  synchroInProgress: boolean;

  constructor(public connectivityService: ConnectivityService,
    public synchronizationProvider: SynchronizationProvider) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      this.synchroInProgress = synchroInProgress;
    });
  }

}
