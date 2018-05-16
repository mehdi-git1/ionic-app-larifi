import { SecurityProvider } from './../../providers/security/security';
import { CareerObjective } from './../../models/careerObjective';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { Waypoint } from './../../models/waypoint';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { ToastProvider } from './../../providers/toast/toast';

@Component({
  selector: 'page-waypoint-create',
  templateUrl: 'waypoint-create.html',
})
export class WaypointCreatePage {

  creationForm: FormGroup;
  careerObjectiveId: number;
  waypoint: Waypoint;
  saveInProgress: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private waypointProvider: WaypointProvider,
    private toastProvider: ToastProvider,
    public securityProvider: SecurityProvider) {

    this.waypoint = new Waypoint();
    this.careerObjectiveId = this.navParams.get('careerObjectiveId');

    // Initialisation du formulaire
    this.creationForm = this.formBuilder.group({
      contextControl: ['', Validators.compose([Validators.maxLength(4000), Validators.required])],
      actionPerformedControl: ['', Validators.compose([Validators.maxLength(5000), Validators.required])],
      managerCommentControl: ['', Validators.maxLength(4000)],
      pncCommentControl: ['', Validators.maxLength(4000)],
    });

    if (this.navParams.get('waypointId')) {
      this.waypointProvider.getWaypoint(this.navParams.get('waypointId')).then(result => {
        this.waypoint = result;
      }, error => {
        this.toastProvider.error(error.detailMessage);
      });
    }

    this.saveInProgress = false;
  }

  /**
   * Lance le processus de création/mise à jour d'un point d'étape
   */
  createWaypoint() {
    this.saveInProgress = true;
    this.waypointProvider
      .createOrUpdate(this.waypoint, this.careerObjectiveId)
      .then(savedWaypoint => {
        this.waypoint = savedWaypoint;
        this.saveInProgress = false;
        this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_SAVED'));
        this.navCtrl.pop();
      }, error => {
        this.saveInProgress = false;
        this.toastProvider.error(error.detailMessage);
      });
  }

}
