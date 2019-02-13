import { NavController } from 'ionic-angular';
import { CongratulationLetterDetailPage } from './../../pages/congratulation-letter-detail/congratulation-letter-detail.page';
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

  @Input() matricule: string;

  CongratulationLetterModeEnum = CongratulationLetterModeEnum;

  constructor(private navCtrl: NavController) {

  }

  /**
   * Vérifie le mode d'affichage actif
   * @param mode le mode à tester
   * @return vrai si le mode testé correspond au mode actif, faux sinon
   */
  isMode(mode: CongratulationLetterModeEnum): boolean {
    return this.mode === mode;
  }

  /**
  * Redirige vers la page de détail d'une lettre de félicitation
  * @param congratulationLetter la lettre qu'on souhaite afficher
  */
  goToCongratulationLetterDetail(congratulationLetter: CongratulationLetterModel): void {
    this.navCtrl.push(CongratulationLetterDetailPage, { matricule: this.matricule, congratulationLetterId: congratulationLetter.techId });
  }

}
