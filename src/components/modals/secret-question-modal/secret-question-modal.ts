import { SecretQuestionError, GlobalError } from './../../../models/securityModalType';
import { ViewController, NavParams } from 'ionic-angular';
import { Component} from '@angular/core';


@Component({
  selector: 'secret-question-modal',
  templateUrl: 'secret-question-modal.html'
})

export class SecretQuestionModal {

  modalType: string;
  question: string;
  errorType: SecretQuestionError | GlobalError;

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
   * @param stringValue Objet contenant les questions réponses
   */
  getValue(stringValue){
    this.viewController.dismiss(stringValue);
  }
}
