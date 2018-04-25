import { TranslateService } from '@ngx-translate/core';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;

  customDateTimeOptions

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public translateService: TranslateService) {
    this.careerObjective = new CareerObjective();

    // Initialisation du formulaire
    this.creationForm = this.formBuilder.group({
      initiatorControl: ['', Validators.required],
      titleControl: ['', Validators.maxLength(255)],
      contextControl: ['', Validators.maxLength(4000)],
      actionPlanControl: ['', Validators.maxLength(5000)],
      managerCommentControl: ['', Validators.maxLength(4000)],
      pncCommentControl: ['', Validators.maxLength(4000)],
      nextEncounterDateControl: [''],
      urgentControl: ['']
    });

    // Options du datepicker
    this.customDateTimeOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.careerObjective.nextEncounterDate = ''
      }]
    }
  }

  ionViewDidLoad() {

  }

  /**
   * Lance le processus de création d'un objectif
   */
  createCareerObjective() {

  }
}
