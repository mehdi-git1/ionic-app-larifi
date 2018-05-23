import { DatePipe } from '@angular/common';
import { SecurityProvider } from './../../providers/security/security';
import { WaypointStatusProvider } from './../../providers/waypoint-status/waypoint-status';
import { WaypointStatus } from './../../models/waypointStatus';
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
  WaypointStatus = WaypointStatus;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private waypointProvider: WaypointProvider,
    private toastProvider: ToastProvider,
    public waypointStatusProvider: WaypointStatusProvider,
    private datePipe: DatePipe,
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
   * Enregistre un point d'étape au statut brouillon
   */
  saveWaypointDraft() {
    this.waypoint.waypointStatus = WaypointStatus.DRAFT;
    this.createWaypoint();
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

        if (this.waypoint.waypointStatus === WaypointStatus.DRAFT) {
          this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.DRAFT_SAVED'));
        } else {
          this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_SAVED'));
        }
        this.navCtrl.push(CareerObjectiveCreatePage, { careerObjectiveId: this.careerObjectiveId });
      }, error => {
        this.saveInProgress = false;
        this.toastProvider.error(error.detailMessage);
      });
  }

  /**
   * Enregistre un point d'étape au statut enregistré
   */
  saveWaypoinToRegisteredStatus() {
    this.waypoint.waypointStatus = WaypointStatus.REGISTERED;
    this.waypoint.registrationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
    this.createWaypoint();
  }
}
