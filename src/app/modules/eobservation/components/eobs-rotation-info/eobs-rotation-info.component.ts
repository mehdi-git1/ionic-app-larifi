import { Component, Input } from '@angular/core';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationFlightModel } from '../../../../core/models/eobservation/eobservation-flight.model';

@Component({
  selector: 'eobs-rotation-info',
  templateUrl: 'eobs-rotation-info.component.html'
})
export class EObsRotationInfoComponent {

  @Input() eObservation: EObservationModel;

  @Input() editMode = false;

  constructor() {
  }

  /**
  * Vérifie qu'il y a des vols
  *
  * @return true si il n'y a pas de vols dans cette eobs, sinon false
  */
  hasFlights(): boolean {
    if (!this.eObservation || !this.eObservation.eobservationFlights || this.eObservation.eobservationFlights.length === 0) {
      return false;
    }
    return true;
  }

  /**
  * Trie les vols de l'eobs
  */
  sortedFlights(): EObservationFlightModel[] {
    if (this.eObservation && this.eObservation.eobservationFlights) {
      return this.eObservation.eobservationFlights.sort((a, b) => a.flightOrder > b.flightOrder ? 1 : -1);
    }
    return new Array();
  }
}
