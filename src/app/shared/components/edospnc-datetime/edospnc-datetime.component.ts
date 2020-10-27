import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../app.constant';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'edospnc-datetime',
  templateUrl: './edospnc-datetime.component.html',
  styleUrls: ['./edospnc-datetime.component.scss'],
  providers: [MakeProvider(EdospncDatetimeComponent)]
})
export class EdospncDatetimeComponent extends AbstractValueAccessor implements OnInit {
  @Input() disabled = false;
  @Input() name: string;
  @Input() displayIcon = true;
  @Input() datePlaceholder: string;
  @Input() edospncFormGroup: FormGroup;
  @Input() edospncFormControlName: string;
  @Input() inputLike = false;

  @ViewChild('datetime', { static: false }) datepicker;

  displayFormat = 'DD/MM/YYYY';
  pickerFormat = 'DD MMMM YYYY';
  pickerOptions: any;
  monthsNames: any;
  datepickerMaxDate = AppConstant.datepickerMaxDate;
  flightDateTimeOptions;

  constructor(public translateService: TranslateService) {
    super();
    this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');
    this.pickerOptions = {
      buttons: [{
        text: translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => {
          this.edospncFormGroup.get(this.edospncFormControlName).setValue('');
        }
      }, {
        text: this.translateService.instant('GLOBAL.DATEPICKER.CANCEL'),
        handler: () => {
          return;
        }
      }, {
        text: this.translateService.instant('GLOBAL.DATEPICKER.DONE'),
        handler: (date) => {
          const month = date.month.value < 10 ? `0${date.month.value}` : date.month.value;
          const day = date.day.value < 10 ? `0${date.day.value}` : date.day.value;
          if (this.edospncFormGroup && this.edospncFormControlName && this.edospncFormGroup.get(this.edospncFormControlName)) {
            this.edospncFormGroup.get(this.edospncFormControlName).setValue(`${date.year.value}-${month}-${day}`);
          } else {
            this.value = `${date.year.value}-${month}-${day}`;
          }
        }
      }]
    };
  }

  ngOnInit() {

  }
}
