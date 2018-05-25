import { DatePipe } from '@angular/common';
import { SecurityProvider } from './../../providers/security/security';
import { WaypointStatusProvider } from './../../providers/waypoint-status/waypoint-status';
import { WaypointStatus } from './../../models/waypointStatus';
import { CareerObjective } from './../../models/careerObjective';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { Waypoint } from './../../models/waypoint';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
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
  loading: Loading;

  // Permet d'exposer l'enum au template
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
    public securityProvider: SecurityProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

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
      }, error => { });
    }

  }

  /**
   * Enregistre un point d'étape au statut brouillon
   */
  saveWaypointDraft() {
    this.waypoint.waypointStatus = WaypointStatus.DRAFT;
    this.saveWaypoint();
  }

  /**
   * Lance le processus de création/mise à jour d'un point d'étape
   */
  saveWaypoint() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.waypointProvider
      .createOrUpdate(this.waypoint, this.careerObjectiveId)
      .then(savedWaypoint => {
        this.waypoint = savedWaypoint;

        if (this.waypoint.waypointStatus === WaypointStatus.DRAFT) {
          this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.DRAFT_SAVED'));
        } else {
          this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_SAVED'));
        }
        this.loading.dismiss();
        this.navCtrl.pop();
      }, error => {
        this.loading.dismiss();
      });
  }

  /**
  * Présente une alerte pour confirmer la suppression du brouillon
  */
  confirmDeleteWaypointDraft() {
    this.alertCtrl.create({
      title: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DRAFT_DELETE.TITLE'),
      message: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DRAFT_DELETE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DRAFT_DELETE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DRAFT_DELETE.CONFIRM'),
          handler: () => this.deleteWaypointDraft()
        }
      ]
    }).present();
  }

  /**
   * Supprime un point d'étape au statut brouillon
   */
  deleteWaypointDraft() {

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.waypointProvider
      .delete(this.waypoint.techId)
      .then(
        deletedWaypoint => {
          this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.DRAFT_DELETED'));
          this.navCtrl.pop();
          this.loading.dismiss();
        },
        error => {
          this.loading.dismiss();
        });
  }

  /**
   * Enregistre un point d'étape au statut enregistré
   */
  saveWaypointToRegisteredStatus() {
    this.waypoint.waypointStatus = WaypointStatus.REGISTERED;
    this.saveWaypoint();
  }
}
