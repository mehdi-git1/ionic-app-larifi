import { Component, Input } from '@angular/core';

import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';

@Component({
  selector: 'color-number-dot',
  templateUrl: 'color-number-dot.component.html',
  styleUrls: ['./color-number-dot.component.scss']
})
export class ColorNumberDotComponent {

  @Input() numberText: string;

  constructor() {
  }

  /**
   * Détermine la classe à utiliser en fonction du texte
   *
   * @return la classe à utiliser
   */
  getNumberDotColorClass(): string {
    if (this.numberText === EObservationLevelEnum.getLabel(EObservationLevelEnum.LEVEL_1)) {
      return 'number-dot-1';
    } else if (this.numberText === EObservationLevelEnum.getLabel(EObservationLevelEnum.LEVEL_2)) {
      return 'number-dot-2';
    } else if (this.numberText === EObservationLevelEnum.getLabel(EObservationLevelEnum.LEVEL_3)
      || this.numberText === EObservationLevelEnum.getLabel(EObservationLevelEnum.C)) {
      return 'number-dot-3';
    } else if (this.numberText === EObservationLevelEnum.getLabel(EObservationLevelEnum.LEVEL_4)) {
      return 'number-dot-4';
    } else {
      return 'number-dot-default';
    }
  }
}
