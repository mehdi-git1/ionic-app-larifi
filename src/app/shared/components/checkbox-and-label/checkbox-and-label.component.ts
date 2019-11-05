import { Component, Input } from '@angular/core';

@Component({
  selector: 'checkbox-and-label',
  templateUrl: 'checkbox-and-label.component.html',
  styleUrls: ['./checkbox-and-label.component.scss']
})
export class CheckboxAndLabelComponent {

  @Input() value: boolean;
  @Input() disabled: boolean;
  @Input() label: string;

}
