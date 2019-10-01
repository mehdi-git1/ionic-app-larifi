import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AppConstant } from './../../../app.constant';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DeviceService } from '../../../core/services/device/device.service';
import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'edospnc-datetime',
  templateUrl: './edospnc-datetime.component.html',
  providers: [MakeProvider(EdospncDatetimeComponent)]
})
export class EdospncDatetimeComponent extends AbstractValueAccessor {
  @Input() disabled = false;
  @Input() pickerOptions: string;
  @Input() name: string;
  @Input() displayIcon = true;
  @Input() datePlaceholder: string;
  @Input() edospncFormGroup: FormGroup;
  @Input() edospncFormControlName: string;
  displayFormat = 'DD/MM/YYYY';
  pickerFormat = 'DD MMMM YYYY';
  monthsNames: any;
  datepickerMaxDate = AppConstant.datepickerMaxDate;
  doneText: string;
  cancelText: string;
  flightDateTimeOptions;

  constructor(public translateService: TranslateService) {
    super();
    this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');
    this.doneText = this.translateService.instant('GLOBAL.DATEPICKER.DONE');
    this.cancelText = translateService.instant('GLOBAL.DATEPICKER.CANCEL');
  }
}
