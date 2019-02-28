import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';

@Component({
  selector: 'radio-and-label',
  templateUrl: 'radio-and-label.component.html'
})
export class RadioAndLabelComponent {

  @Input() conditionValue: boolean;
  @Input() disabled: boolean;
  @Input() label: string;

  constructor() {
  }

}
