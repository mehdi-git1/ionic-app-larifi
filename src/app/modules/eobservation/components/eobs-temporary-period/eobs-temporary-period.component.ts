import { Component, Input } from '@angular/core';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';

@Component({
  selector: 'eobs-temporary-period',
  templateUrl: 'eobs-temporary-period.component.html'
})
export class EObsTemporaryPeriodComponent {

  @Input() eObservation: EObservationModel;

  constructor() {
  }

  /**
   * Définit si la periode temporaire est affichable
   * @return true si 'ECC' ou 'ECCP' et si l'une des valeurs "vol de formation" ou "val" est true
   */
  hasTemporaryPeriodToBeDisplayed(): boolean {
    return this.eObservation
      && (this.eObservation.type === EObservationTypeEnum.E_CC || this.eObservation.type === EObservationTypeEnum.E_CCP)
      && (this.eObservation.formationFlight || this.eObservation.val);
  }
}
