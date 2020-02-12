import { Component, Input } from '@angular/core';

import { Utils } from '../../utils/utils';

@Component({
  selector: 'value-or-no-data',
  templateUrl: './value-or-no-data.component.html',
  styleUrls: ['./value-or-no-data.component.scss'],
})
export class ValueOrNoDataComponent {

  @Input() value: string;

  @Input() displayDash = false;

  constructor() { }

  valueIsValid() {
    return !Utils.isEmpty(this.value);
  }
}
