import { CongratulationLetterModeEnum } from './../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { Component, Input } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
  selector: 'congratulation-letter-list',
  templateUrl: 'congratulation-letter-list.component.html'
})
export class CongratulationLetterListComponent {

  @Input() mode: CongratulationLetterModeEnum;

  @Input() congratulationLetters: CongratulationLetterModel[];

  @Input() pnc: PncModel;

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
