import { Component } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity.service';

@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  constructor(public connectivitService: ConnectivityService) {
  }
}
