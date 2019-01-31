import { Component, Input } from '@angular/core';

@Component({
  selector: 'e-observation',
  templateUrl: 'e-observation.component.html'
})

export class EObservationComponent {

  matPanelHeaderHeight = 'auto';

  @Input() eObs;


  constructor() {
  }
}
