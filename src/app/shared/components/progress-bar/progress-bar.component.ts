import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../core/services/device/device.service';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.component.html'
})
export class ProgressBarComponent {
  @Input('progress') progress;
}
