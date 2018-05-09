import { Waypoint } from './../../models/waypoint';
import { WaypointCreatePage } from './../waypoint-create/waypoint-create';
import { TranslateService } from '@ngx-translate/core';
import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pnc } from '../../models/Pnc';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;

  customDateTimeOptions: any;
  saveInProgress: boolean;
  waypoint: Waypoint;
  waypointList: Waypoint[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastCtrl: ToastController) {

    this.careerObjective = new CareerObjective();
    this.careerObjective.pnc = new Pnc();
    this.waypoint = new Waypoint();

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
      prioritizedControl: [false],
      waypointContextControl: ['', Validators.maxLength(4000)]
    });

    // Options du datepicker
    this.customDateTimeOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.careerObjective.nextEncounterDate
      }]
    };

    this.saveInProgress = false;
  }

  ionViewDidLoad() {

    if (this.navParams.get('return')) {
      this.careerObjective = this.navParams.get('careerObjective');
      console.log("careerObjective", this.careerObjective);
      this.waypointList = this.navParams.get('waypointList');
      console.log("waypoint", this.waypointList);
    }
  }

  /**
   * Lance le processus de création/mise à jour d'un objectif
   */
  createCareerObjective() {
    this.saveInProgress = true;
    this.careerObjective.nextEncounterDate = new Date(this.careerObjective.nextEncounterDate);
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

  /**
   * Dirige vers la page de création d'un point d'étape
   */
  goToWaypointCreate() {
    this.navCtrl.push(WaypointCreatePage, { careerObjective: this.careerObjective, waypointList: this.waypointList });
  }
}
