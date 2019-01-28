import { EObservationModel } from './../../../core/models/eobservation.model';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'e-observations',
  templateUrl: 'e-observations.component.html'
})

export class EObservationsComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  @Input() eObservations: EObservationModel[];

  constructor() {
  }
  ngOnChanges() {
    console.log(this.eObservations);
  }
}
