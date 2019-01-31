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
  nbOfYearsToChangeMessage = 3;

  @Input() eObservations: EObservationModel[];

  constructor() {
  }

  ngOnChanges() {
    if (this.eObservations[0]) {
      this.isOlderThan3Years = moment.duration(
        moment(moment())
          .diff(moment(this.eObservations[this.eObservations.length - 1].rotationDate)))
        .asYears() > this.nbOfYearsToChangeMessage;
      console.log(moment.duration(
        moment(moment())
          .diff(moment(this.eObservations[this.eObservations.length - 1].rotationDate)))
        .asYears());
    }
  }

}
