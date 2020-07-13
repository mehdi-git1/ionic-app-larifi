import { Component, Input } from '@angular/core';

@Component({
  selector: 'edossier-spinner',
  templateUrl: 'edossier-spinner.component.html',
  styleUrls: ['./edossier-spinner.component.scss']
})

export class EdossierSpinnerComponent {

  @Input() verticalMargin = 0;
  @Input() diameter = 100;

  constructor() { }

}
