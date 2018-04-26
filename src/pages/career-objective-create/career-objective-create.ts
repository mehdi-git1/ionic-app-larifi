import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { TranslateService } from '@ngx-translate/core';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;

  customDateTimeOptions: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastCtrl: ToastController) {
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
      urgentControl: [false]
    });

    // Options du datepicker
    this.customDateTimeOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.careerObjective.nextEncounterDate = ''
      }]
    };
  }

  ionViewDidLoad() {

  }

  /**
   * Lance le processus de création d'un objectif
   */
  createCareerObjective() {
    this.careerObjectiveProvider
      .create(this.careerObjective)
      .then(createdCareerObjective => {
        this.toastCtrl.create({
          message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_CREATED'),
          duration: 3000,
          position: 'bottom'
        }).present();
      }, error => {
        console.log(error);
        this.toastCtrl.create({
          message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.ERROR.CAREER_OBJECTIVE_CREATION_FAILED'),
          duration: 30000,
          position: 'bottom',
          cssClass: 'error',
        }).present();
      });
  }
}
