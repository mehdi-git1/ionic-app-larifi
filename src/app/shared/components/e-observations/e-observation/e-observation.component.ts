import { Component, Input } from '@angular/core';

@Component({
  selector: 'e-observation',
  templateUrl: 'e-observation.component.html'
})

export class EObservationComponent {

  @Input() eObs;


  constructor() {
  }
}
