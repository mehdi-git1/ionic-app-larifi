import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';

@Component({
  selector: 'download-button',
  templateUrl: 'download-button.component.html'
})
export class DownloadButtonComponent {

  @Input() synchroInProgress: boolean;

  @Output() onDownload: EventEmitter<any> = new EventEmitter();

  constructor(public connectivityService: ConnectivityService,
    private deviceService: DeviceService) {
  }

  downloadFunction(evt: Event): void {
    evt.stopPropagation();
    this.onDownload.next();
  }

  /**
   * Détermine si le bouton est disponible
   * @return vrai s'il est dispo, faux sinon
   */
  isAvailable(): boolean {
    return this.connectivityService.isConnected() && this.deviceService.isOfflineModeAvailable();
  }

}
