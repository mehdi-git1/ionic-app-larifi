import { Component } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity.service';

@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  connected: boolean;

  constructor(public connectivityService: ConnectivityService) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });
  }

}
