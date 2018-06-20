import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { Component } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity.service';

@Component({
  selector: 'offline-indicator',
  templateUrl: 'offline-indicator.html'
})
export class OfflineIndicatorComponent {

  connected: boolean;

  constructor(public connectivityService: ConnectivityService,
    private toastProvider: ToastProvider,
    private translateService: TranslateService) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
      if (!connected) {
        toastProvider.warning(this.translateService.instant('GLOBAL.CONNECTIVITY.OFFLINE_MODE'));
      } else {
        toastProvider.success(this.translateService.instant('GLOBAL.CONNECTIVITY.ONLINE_MODE'));
      }
    });
  }

}
