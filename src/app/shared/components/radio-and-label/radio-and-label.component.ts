import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'radio-and-label',
  templateUrl: 'radio-and-label.component.html',
  styleUrls: ['./radio-and-label.component.scss']
})
export class RadioAndLabelComponent {

  @Input() conditionValue: boolean;
  @Input() disabled: boolean;
  @Input() label: string;
  @Output() stateChange = new EventEmitter<boolean>();

  constructor() {
  }

  /**
   * Emet un évènement contenant l'état de la checkbox
   * @param checked état de la checkbox
   *
   */
  checkboxStateChange(checked: boolean): void {
    this.stateChange.emit(checked);
  }
}
