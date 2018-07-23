import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ConnectivityService } from './../../services/connectivity.service';
import { Component } from '@angular/core';

@Component({
  selector: 'connectivity-indicator',
  templateUrl: 'connectivity-indicator.html'
})
export class ConnectivityIndicatorComponent {

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