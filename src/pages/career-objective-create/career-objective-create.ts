import { TranslateService } from '@ngx-translate/core';
import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pnc } from '../../models/pnc';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;

  customDateTimeOptions: any;
  saveInProgress: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastCtrl: ToastController) {

    this.careerObjective = new CareerObjective();
    this.careerObjective.pnc = new Pnc();

    // Initialisation du formulaire
    this.creationForm = this.formBuilder.group({
      pncMatriculeControl: ['', Validators.required],
      initiatorControl: ['', Validators.required],
      titleControl: ['', Validators.compose([Validators.maxLength(255), Validators.required])],
      contextControl: ['', Validators.maxLength(4000)],
      actionPlanControl: ['', Validators.maxLength(5000)],
      managerCommentControl: ['', Validators.maxLength(4000)],
      pncCommentControl: ['', Validators.maxLength(4000)],
      nextEncounterDateControl: [''],
      prioritizedControl: [false]
    });

    // Options du datepicker
    this.customDateTimeOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.careerObjective.nextEncounterDate = ''
      }]
    };

    this.saveInProgress = false;
  }

  ionViewDidLoad() {

  }

  /**
   * Lance le processus de création/mise à jour d'un objectif
   */
  createCareerObjective() {
    this.saveInProgress = true;
    this.careerObjectiveProvider
      .createOrUpdate(this.careerObjective)
      .then(savedCareerObjective => {
        this.careerObjective = savedCareerObjective;

        this.saveInProgress = false;
        this.toastCtrl.create({
          message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_SAVED'),
          duration: 3000,
          position: 'bottom',
          cssClass: 'success'
        }).present();
      }, error => {
        this.saveInProgress = false;

        this.toastCtrl.create({
          message: error.detailMessage,
          duration: 3000,
          position: 'bottom',
          cssClass: 'error',
        }).present();
      });
  }
}
