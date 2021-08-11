import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';

@Component({
  selector: 'eobs-temporary-period',
  templateUrl: 'eobs-temporary-period.component.html',
  styleUrls: ['./eobs-temporary-period.component.scss']
})
export class EObsTemporaryPeriodComponent {

  @Input() eObservation: EObservationModel;
  @Input() disabled = false;
  constructor() {
  }

  /**
   * Définit si la periode temporaire est affichable
   * @return true si 'ECC' ou 'ECCP' et si l'une des valeurs "vol de formation" ou "val" est true
   */
  hasTemporaryPeriodToBeDisplayed(): boolean {
    return this.eObservation
      && (this.eObservation.type === EObservationTypeEnum.E_CC || this.eObservation.type === EObservationTypeEnum.E_CCP)
      && (this.eObservation.formationFlight || this.eObservation.val || this.eObservation.ffc);
  }

  /**
   * Met à jour le vol de formation
   * @param state état de la checkbox
   */
  updateFormationFlight(state: boolean) {
    this.eObservation.formationFlight = state;
    this.eObservation.val = false;
    this.eObservation.ffc = false;
  }

  /**
   * Met à jour la checkbox val
   * @param state état de la checkbox
   */
  updateVal(state: boolean) {
    this.eObservation.val = true;
    this.eObservation.formationFlight = false;
    this.eObservation.ffc = false;
  }


  /**
   * Met à jour le vol de formation faisant fonction CC
   * @param state état de la checkbox
   */
  updateFfc(state: boolean) {
    this.eObservation.ffc = true;
    this.eObservation.val = false;
    this.eObservation.formationFlight = false;
  }
}
