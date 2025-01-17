import { Component, Input } from '@angular/core';

import { EObservationStateEnum } from '../../../../core/enums/e-observation-state.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';

@Component({
  selector: 'eobs-state',
  templateUrl: 'eobs-state.component.html',
  styleUrls: ['./eobs-state.component.scss']
})
export class EObsStateComponent {

  @Input() eObservation: EObservationModel;

  @Input() editMode = false;

  constructor() {
  }

  /**
   * Définit la couleur en fonction du statut
   *
   * @return 'green' si 'TAKEN_INTO_ACCOUNT' ou 'red' si 'NOT_TAKEN_INTO_ACCOUNT'
   */
  getColorStatusPoint(): string {
    if (this.eObservation && this.eObservation.state === EObservationStateEnum.TAKEN_INTO_ACCOUNT) {
      return 'green';
    } else if (this.eObservation && this.eObservation.state === EObservationStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
      return 'red';
    }
  }
}
