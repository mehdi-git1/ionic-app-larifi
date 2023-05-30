import { EObservationSubTypeEnum } from './../../../../core/enums/e-observation-subtype.enum';
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


  /**
 * Vérifie que le sous-type est VAL 
 * @return vrai si le sous-type est VAL, faux sinon
 */
  isVal(): boolean {
    return this.eObservation.subType === EObservationSubTypeEnum.VAL
  }

  /**
 * Met à jour le sous-type
 */
  updateSubType(event) {
    this.eObservation.subType = event.detail.checked ? EObservationSubTypeEnum.VAL : EObservationSubTypeEnum.CLASSICAL;
  }

}
