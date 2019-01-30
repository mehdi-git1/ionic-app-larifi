import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

import { EObservationModel } from './../../../core/models/eobservation.model';

@Component({
  selector: 'e-observations',
  templateUrl: 'e-observations.component.html'
})

export class EObservationsComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';
  isOlderThan3Years = false;

  @Input() eObservations: EObservationModel[];

  constructor() {
  }

  ngOnChanges() {
    if (this.eObservations[0]) {
      this.isOlderThan3Years = moment.duration(
        moment(this.eObservations[0].rotationDate)
          .diff(moment(this.eObservations[this.eObservations.length - 1].rotationDate)))
        .asYears() > 3;
    }
  }

}
