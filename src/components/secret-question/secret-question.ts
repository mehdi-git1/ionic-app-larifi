import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewController } from 'ionic-angular';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { SecretQuestionType } from './../../models/securitymodalType';

@Component({
  selector: 'secret-question',
  templateUrl: 'secret-question.html'
})

export class SecretQuestionComponent implements OnInit{

  @Output() QuestionAnswerValue = new EventEmitter();
  @Input() modalType = '';
  @Input() questionToAnswer = '';

  newQuestionForm: FormGroup;
  answerQuestionForm: FormGroup;

  secretQuestionType = SecretQuestionType;

  constructor(
    public viewController: ViewController,
    public formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(){
  }

  initForm() {
    this.newQuestionForm = this.formBuilder.group({
        questionControl: ['', [Validators.required]],
        answerControl:  ['', [Validators.required]],
    });

    this.answerQuestionForm = this.formBuilder.group({
      answerControl:  ['', [Validators.required]],
  });
  }

  sendData(){
    const sendObj = {
      secretQuestion : this.newQuestionForm.controls.questionControl.value,
      secretAnswer : this.newQuestionForm.controls.answerControl.value,
    };
    this.QuestionAnswerValue.emit(sendObj);
  }
}
