import { Utils } from './../../utils/utils';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'value-or-no-data',
  templateUrl: './value-or-no-data.component.html',
  styleUrls: ['./value-or-no-data.component.scss'],
})
export class ValueOrNoDataComponent {

  @Input() value;

  constructor() { }

  valueIsValid() {
    return !Utils.isEmpty(this.value);
  }
}
