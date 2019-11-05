import { Component, Input } from '@angular/core';

@Component({
  selector: 'radio-and-label',
  templateUrl: 'radio-and-label.component.html',
  styleUrls: ['./radio-and-label.component.scss']
})
export class RadioAndLabelComponent {

  @Input() conditionValue: boolean;
  @Input() disabled: boolean;
  @Input() label: string;

  constructor() {
  }

}
