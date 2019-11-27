import { Component, Input } from '@angular/core';

import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';

@Component({
  selector: 'eobs-bilan-flight',
  templateUrl: 'eobs-bilan-flight.component.html',
  styleUrls: ['./eobs-bilan-flight.component.scss']
})
export class EObsBilanFlightComponent {

  @Input() eObservation: EObservationModel;

  @Input() editMode = false;

}
