import { ViewController, NavParams } from 'ionic-angular';
import { Component} from '@angular/core';


@Component({
  selector: 'secret-question-modal',
  templateUrl: 'secret-question-modal.html'
})

export class SecretQuestionModal {

  modalType: string;
  question: string;

  constructor(
    public viewController: ViewController,
    public navParams: NavParams
  ) {
    this.modalType = navParams.get('typeModal');
    this.question = navParams.get('question');
  }

  getValue(stringValue){
    console.log(stringValue);
    this.viewController.dismiss(stringValue);
  }
}
