import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';

@Component({
  selector: 'checkbox-and-label',
  templateUrl: 'checkbox-and-label.component.html'
})
export class CheckboxAndLabelComponent {

  @Input() value: boolean;
  @Input() disabled: boolean;
  @Input() label: string;

}
