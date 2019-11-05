import * as moment from 'moment';

import { Component, Input, OnChanges } from '@angular/core';

import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';

@Component({
  selector: 'e-observations',
  templateUrl: 'e-observations.component.html',
  styleUrls: ['./e-observations.component.scss']
})

export class EObservationsComponent implements OnChanges {

  matPanelHeaderHeight = '41px';
  isOlderThan3Years = false;
  nbOfYearsToChangeMessage = 3;

  @Input() eObservations: EObservationModel[];

  @Input() eObservationDisplayMode;

  @Input() legend = true;

  ngOnChanges() {
    this.defineLegendMessage();
  }

  /**
   * Défini la légende à afficher en fonction de l'ancienneté des eObservations
   */
  defineLegendMessage(): void {
    if (this.eObservations[0]) {
      this.isOlderThan3Years = moment.duration(
        moment(moment())
          .diff(moment(this.eObservations[this.eObservations.length - 1].rotationDate)))
        .asYears() > this.nbOfYearsToChangeMessage;
    }
  }
}
