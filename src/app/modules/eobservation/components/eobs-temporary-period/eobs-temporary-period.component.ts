import { Component, Input } from '@angular/core';
import { EObservationSubTypeEnum } from 'src/app/core/enums/e-observation-subtype.enum';

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

  EObservationSubTypeEnum = EObservationSubTypeEnum;

  constructor() {
  }

  /**
   * Définit si la periode temporaire est affichable
   * @return true si 'ECC' ou 'ECCP' et si l'une des valeurs "vol de formation" ou "val" est true
   */
  hasTemporaryPeriodToBeDisplayed(): boolean {
    return this.eObservation
      && (this.eObservation.type === EObservationTypeEnum.E_CC || this.eObservation.type === EObservationTypeEnum.E_CCP)
      && (this.eObservation.subType !== EObservationSubTypeEnum.CLASSICAL && this.eObservation.subType !== null && this.eObservation.subType !== EObservationSubTypeEnum.VAC);
  }

  /**
   * Met à jour la checkbox
   * @param value la valeur qu'on veut mettre à jour
   */
  updateSubType(value: EObservationSubTypeEnum) {
    this.eObservation.subType = value;
  }

  /**
   * Vérifie que le sous-type est TRAINING_FLIGHT 
   * @return vrai si le sous-type est TRAINING_FLIGHT, faux sinon
   */
  isTrainingFlight(): boolean {
    return this.eObservation.subType === EObservationSubTypeEnum.TRAINING_FLIGHT
  }

  /**
   * Vérifie que le sous-type est VAL 
   * @return vrai si le sous-type est VAL, faux sinon
   */
  isVal(): boolean {
    return this.eObservation.subType === EObservationSubTypeEnum.VAL
  }

  /**
   * Vérifie que le sous-type est ACCO_SV 
   * @return vrai si le sous-type est ACCO_SV, faux sinon
   */
  isAccoSV(): boolean {
    return this.eObservation.subType === EObservationSubTypeEnum.ACCO_SV
  }

  /**
   * Vérifie que le sous-type est FFC 
   * @return vrai si le sous-type est FFC, faux sinon
   */
  isffc(): boolean {
    return this.eObservation.subType === EObservationSubTypeEnum.FFC
  }
}
