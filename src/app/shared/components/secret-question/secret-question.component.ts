import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { GlobalErrorEnum } from '../../../core/enums/global-error.enum';
import {
    SecretQuestionErrorTextEnum
} from '../../../core/enums/security/secret-question-error-text.enum';
import { SecretQuestionTitleEnum } from '../../../core/enums/security/secret-question-title.enum';
import { SecretQuestionTypeEnum } from '../../../core/enums/security/secret-question-type.enum';

@Component({
  selector: 'secret-question',
  templateUrl: 'secret-question.component.html',
  styleUrls: ['./secret-question.component.scss']
})
export class SecretQuestionComponent implements OnInit {

  @Output() questionAnswerValue = new EventEmitter();
  @Input() modalType = '';
  @Input() questionToAnswer = '';
  @Input() errorType = '';

  newQuestionForm: FormGroup;
  answerQuestionForm: FormGroup;

  modalTitle = '';
  errorText = '';

  secretQuestionType = SecretQuestionTypeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.modalTitle = this.translateService.instant(SecretQuestionTitleEnum[this.modalType]);
    this.errorText = this.errorType === GlobalErrorEnum.none ?
      '' : this.translateService.instant(SecretQuestionErrorTextEnum[this.errorType]);
  }

  /**
   * Initialisation des formulaires
   * Soit un formulaire de nouvelle question
   * Soit un formulaire de réponse à la question
   */
  initForm() {
    this.newQuestionForm = this.formBuilder.group({
      questionControl: ['', [Validators.required]],
      answerControl: ['', [Validators.required]],
    });

    this.answerQuestionForm = this.formBuilder.group({
      answerControl: ['', [Validators.required]],
    });
  }

  /**
   * Renvoi les différents données sous deux formes
   * Un objet contenant une question et une réponse pour l'init
   * Un objet contenant la réponse pour la réponse à la question
   */
  sendData() {
    let sendObj;
    if (this.modalType === this.secretQuestionType.newQuestion) {
      sendObj = {
        secretQuestion: this.newQuestionForm.controls.questionControl.value,
        secretAnswer: this.newQuestionForm.controls.answerControl.value,
      };
    } else {
      sendObj = {
        secretAnswer: this.answerQuestionForm.controls.answerControl.value,
      };
    }
    this.questionAnswerValue.emit(sendObj);
  }
}
