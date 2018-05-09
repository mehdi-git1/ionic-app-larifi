import { CareerObjective } from './../../models/careerObjective';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { Waypoint } from './../../models/waypoint';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';

@Component({
  selector: 'page-waypoint-create',
  templateUrl: 'waypoint-create.html',
})
export class WaypointCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;
  waypoint: Waypoint;
  techId: any;
  customDateTimeOptions: any;
  saveInProgress: boolean;
  return: boolean;
  waypointList: Waypoint[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private waypointProvider: WaypointProvider,
    private toastCtrl: ToastController) {

    this.waypoint = new Waypoint();
    this.careerObjective = this.navParams.get('careerObjective');
    console.log("careerObjective", this.careerObjective);
    this.waypoint.careerObjective = this.careerObjective;
    this.waypointList = this.navParams.get('waypointList');
    this.waypointList.push(this.waypoint);


    // Initialisation du formulaire
    this.creationForm = this.formBuilder.group({
      contextControl: ['', Validators.compose([Validators.maxLength(4000), Validators.required])],
      actionPerformedControl: ['', Validators.compose([Validators.maxLength(5000), Validators.required])],
      managerCommentControl: ['', Validators.maxLength(4000)],
      pncCommentControl: ['', Validators.maxLength(4000)],
    });

    // Options du datepicker
    this.customDateTimeOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.waypoint.nextEncounterDate
      }]
    };

    this.saveInProgress = false;
  }
  ionViewDidLoad() {
  }

  /**
   * Lance le processus de création/mise à jour d'un point d'étape
   */
  createWaypoint() {
    this.saveInProgress = true;

    this.waypointProvider
      .createOrUpdate(this.waypoint)
      .then(savedWaypoint => {
        this.waypoint = savedWaypoint;
        this.saveInProgress = false;
        this.toastCtrl.create({
          message: this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_SAVED'),
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
    this.navCtrl.push(CareerObjectiveCreatePage, { careerObjective: this.careerObjective, waypointList: this.waypointList, return: true });
  }

}
