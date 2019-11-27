import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { GlobalErrorEnum } from '../../../../core/enums/global-error.enum';
import {
    SecretQuestionErrorEnum
} from '../../../../core/enums/security/secret-question-error.enum';

@Component({
  selector: 'secret-question-modal',
  templateUrl: 'secret-question-modal.component.html',
  styleUrls: ['./secret-question-modal.component.scss']
})

export class SecretQuestionModalComponent {

  modalType: string;
  question: string;
  errorType: SecretQuestionErrorEnum | GlobalErrorEnum;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.modalType = this.navParams.get('modalType');
    this.question = this.navParams.get('question');
    this.errorType = this.navParams.get('errorType');
  }

  /**
   * Fonctions passe-plat qui remonte cette information au service
   * @param ObjetQuestionAnswer Objet contenant les questions réponses
   */
  getValue(ObjetQuestionAnswer) {
    this.modalCtrl.dismiss(ObjetQuestionAnswer);
  }
}
