import { SecretQuestionModal } from './../modals/secret-question-modal/secret-question-modal';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { SecretQuestionType, SecretQuestionTitle, GlobalError, SecretQuestionErrorText } from './../../models/securityModalType';

@Component({
  selector: 'secret-question',
  templateUrl: 'secret-question.html'
})

export class SecretQuestionComponent implements OnInit{

  @Output() questionAnswerValue = new EventEmitter();
  @Input() modalType = '';
  @Input() questionToAnswer = '';
  @Input() errorType = '';

  newQuestionForm: FormGroup;
  answerQuestionForm: FormGroup;

  modalTitle = '';
  errorText = '';

  secretQuestionType = SecretQuestionType;

  constructor(
    public viewController: ViewController,
    public formBuilder: FormBuilder,
    public translateService: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit(){
    this.modalTitle = this.translateService.instant(SecretQuestionTitle[this.modalType]);
    this.errorText = this.errorType === GlobalError.none ? '' : this.translateService.instant(SecretQuestionErrorText[this.errorType]);
  }

  /**
   * Initialisation des formulaires
   * Soit un formulaire de nouvelle question
   * Soit un formulaire de réponse à la question
   */
  initForm() {
    this.newQuestionForm = this.formBuilder.group({
        questionControl: ['', [Validators.required]],
        answerControl:  ['', [Validators.required]],
    });

    this.answerQuestionForm = this.formBuilder.group({
      answerControl:  ['', [Validators.required]],
  });
  }

  /**
   * Renvoi les différents données sous deux formes
   * Un objet contenant une question et une réponse pour l'init
   * Un objet contenant la réponse pour la réponse à la question
   */
  sendData(){
    let sendObj;
    if (this.modalType === this.secretQuestionType.newQuestion){
      sendObj = {
        secretQuestion : this.newQuestionForm.controls.questionControl.value,
        secretAnswer : this.newQuestionForm.controls.answerControl.value,
      };
    } else {
      sendObj = {
        secretAnswer : this.answerQuestionForm.controls.answerControl.value,
      };
    }
    this.questionAnswerValue.emit(sendObj);
  }
}
