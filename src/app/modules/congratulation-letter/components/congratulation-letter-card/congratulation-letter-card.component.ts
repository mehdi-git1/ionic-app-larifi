import { CongratulationLetterModeEnum } from './../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { Component, Input } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';

@Component({
  selector: 'congratulation-letter-card',
  templateUrl: 'congratulation-letter-card.component.html'
})
export class CongratulationLetterCardComponent {

  @Input() mode: CongratulationLetterModeEnum;

  @Input() congratulationLetter: CongratulationLetterModel;

  CongratulationLetterModeEnum = CongratulationLetterModeEnum;

  /**
   * Vérifie le mode d'affichage actif
   * @param mode le mode à tester
   * @return vrai si le mode testé correspond au mode actif, faux sinon
   */
  isMode(mode: CongratulationLetterModeEnum): boolean {
    return this.mode === mode;
  }

}
