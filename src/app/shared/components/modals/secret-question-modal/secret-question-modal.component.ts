import { GlobalErrorEnum } from '../../../../core/enums/global-error.enum';
import { ViewController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { SecretQuestionErrorEnum } from '../../../../core/enums/security/secret-question-error.enum';


@Component({
  selector: 'secret-question-modal',
  templateUrl: 'secret-question-modal.component.html'
})

export class SecretQuestionModalComponent {

  modalType: string;
  question: string;
  errorType: SecretQuestionErrorEnum | GlobalErrorEnum;

  constructor(
    public viewController: ViewController,
    public navParams: NavParams
  ) {
    this.modalType = navParams.get('modalType');
    this.question = navParams.get('question');
    this.errorType = navParams.get('errorType');
  }

  /**
   * Fonctions passe-plat qui remonte cette information au service
   * @param ObjetQuestionAnswer Objet contenant les questions réponses
   */
  getValue(ObjetQuestionAnswer) {
    this.viewController.dismiss(ObjetQuestionAnswer);
  }
}
