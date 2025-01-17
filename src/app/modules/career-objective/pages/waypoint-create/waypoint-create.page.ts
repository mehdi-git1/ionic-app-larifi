import * as _ from 'lodash-es';
import { FormCanDeactivate } from 'src/app/routing/guards/form-changes.guard';

import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { WaypointStatusEnum } from '../../../../core/enums/waypoint.status.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { WaypointModel } from '../../../../core/models/waypoint.model';
import {
    CancelChangesService
} from '../../../../core/services/cancel_changes/cancel-changes.service';
import {
    OfflineCareerObjectiveService
} from '../../../../core/services/career-objective/offline-career-objective.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    WaypointStatusService
} from '../../../../core/services/waypoint-status/waypoint-status.service';
import {
    OfflineWaypointService
} from '../../../../core/services/waypoint/offline-waypoint.service';
import { WaypointService } from '../../../../core/services/waypoint/waypoint.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { Utils } from '../../../../shared/utils/utils';

@Component({
  selector: 'page-waypoint-create',
  templateUrl: 'waypoint-create.page.html',
  styleUrls: ['./waypoint-create.page.scss']
})
export class WaypointCreatePage extends FormCanDeactivate {

  creationForm: FormGroup;
  waypoint: WaypointModel;
  originWaypoint: WaypointModel;
  requiredOnEncounterDay: boolean;

  originalPncComment: string;

  pnc: PncModel;
  waypointContextMaxLength = 4000;
  actionPerformedMaxLength = 5000;
  managerCommentMaxLength = 4000;
  pncCommentMaxLength = 4000;

  // Permet d'exposer l'enum au template
  WaypointStatus = WaypointStatusEnum;

  @ViewChild('form', { static: false }) form: NgForm;

  constructor(
    public securityService: SecurityService,
    public waypointStatusService: WaypointStatusService,
    private translateService: TranslateService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private waypointService: WaypointService,
    private toastService: ToastService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private deviceService: DeviceService,
    private dateTransformer: DateTransform,
    private connectivityService: ConnectivityService,
    private offlineCareerObjectiveService: OfflineCareerObjectiveService,
    private offlineWaypointService: OfflineWaypointService,
    private pncService: PncService,
    private cancelChangeService: CancelChangesService) {
    super();
    this.requiredOnEncounterDay = false;

    this.initForm();
  }

  ionViewDidEnter() {
    this.initPage();
  }

  /**
   * Initialisation du contenu de la page.
   */
  async initPage() {
    this.pnc = await this.pncService.getPnc(this.pncService.getRequestedPncMatricule(this.activatedRoute));

    if (this.activatedRoute.snapshot.paramMap.get('waypointId')
      && parseInt(this.activatedRoute.snapshot.paramMap.get('waypointId'), 10) !== 0) {
      // Récupération du point d'étape
      this.waypointService.getWaypoint(parseInt(this.activatedRoute.snapshot.paramMap.get('waypointId'), 10))
        .then(waypoint => {
          this.originWaypoint = _.cloneDeep(waypoint);
          this.waypoint = waypoint;
          this.originalPncComment = this.waypoint.pncComment;
        }, error => { });
    } else {
      // Création
      this.waypoint = new WaypointModel();
      this.waypoint.careerObjective = new CareerObjectiveModel();
      this.waypoint.careerObjective.techId = parseInt(this.activatedRoute.snapshot.paramMap.get('careerObjectiveId'), 10);
      this.originWaypoint = _.cloneDeep(this.waypoint);
    }
  }

  /**
   * Verifie si des modifications ont été faites, avant d'initialiser le contenu de la page.
   * si oui, on affiche une popup de confirmation d'abandon des modifications
   * si non, on initialise la page.
   */
  refreshPage() {
    if (this.formHasBeenModified()) {
      this.cancelChangeService.openCancelChangesPopup().then((confirm) => {
        if (confirm) {
          this.creationForm.reset();
          this.initPage();
        }
      }, error => {

      });
    } else {
      this.initPage();
    }
  }

  /**
   * Vérifie si l'on peut quitter la page
   * @return true si le formulaire n'a pas été modifié
   */
  canDeactivate(): boolean {
    return !this.formHasBeenModified();
  }

  /**
   * Vérifie si le formulaire a été modifié sans être enregistré
   */
  formHasBeenModified() {
    return Utils.getHashCode(this.originWaypoint) !== Utils.getHashCode(this.waypoint);
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.creationForm = this.formBuilder.group({
      contextControl: ['', Validators.compose([Validators.maxLength(this.waypointContextMaxLength), Validators.required])],
      actionPerformedControl: ['', Validators.maxLength(this.actionPerformedMaxLength)],
      managerCommentControl: ['', Validators.maxLength(this.managerCommentMaxLength)],
      pncCommentControl: ['', Validators.maxLength(this.pncCommentMaxLength)],
      encounterDateControl: [''],
    });
  }

  /**
   * Teste si le point d'étape est un brouillon.
   * @return true si le point d'étape est un brouillon, false sinon.
   */
  isDraft(): boolean {
    return !this.waypoint.waypointStatus || this.waypoint.waypointStatus === WaypointStatusEnum.DRAFT;
  }

  /**
   * Enregistre un point d'étape au statut brouillon et ne notifie pas le manager
   */
  saveWaypointDraft() {
    const waypointToSave = _.cloneDeep(this.waypoint);
    waypointToSave.waypointStatus = WaypointStatusEnum.DRAFT;
    this.saveWaypoint(waypointToSave);
  }

  /**
   * Présente une alerte pour confirmer la demande de notification du manager
   */
  confirmManagerNotification() {
    this.alertCtrl.create({
      header: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_MANAGER_NOTIFICATION.TITLE'),
      message: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_MANAGER_NOTIFICATION.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_MANAGER_NOTIFICATION.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_MANAGER_NOTIFICATION.CONFIRM'),
          handler: () => this.saveWaypointDraftAndNotifyManager()
        }
      ]
    }).then(alert => alert.present());
  }
  
  /**
   * Enregistre un point d'étape au statut brouillon et notifie le manager
   */
  saveWaypointDraftAndNotifyManager() {
    const waypointToSave = _.cloneDeep(this.waypoint);
    waypointToSave.waypointStatus = WaypointStatusEnum.DRAFT;
    waypointToSave.careerObjective.instructorToBeNotified = true;
    this.saveWaypoint(waypointToSave);
  }

  /**
   * Lance le processus de création/mise à jour d'un point d'étape
   * @param waypointToSave le point d'étape à enregistrer
   */
  saveWaypoint(waypointToSave: WaypointModel): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      waypointToSave = this.prepareWaypointBeforeSubmit(waypointToSave);

      this.loadingCtrl.create().then(loading => {
        loading.present();

        this.waypointService
          .createOrUpdate(waypointToSave, this.waypoint.careerObjective.techId)
          .then(savedWaypoint => {
            this.originWaypoint = _.cloneDeep(savedWaypoint);
            this.waypoint = savedWaypoint;

            // Si on est connecté et que l'objectif dont dépend le point d'étape est en cache, on met en cache le point d'étape
            if (this.deviceService.isOfflineModeAvailable()
              && this.connectivityService.isConnected()
              && this.offlineCareerObjectiveService.careerObjectiveExists(this.waypoint.careerObjective.techId)) {
              this.offlineWaypointService.createOrUpdate(this.waypoint, this.waypoint.careerObjective.techId, true);
            }

            if (this.waypoint.waypointStatus === WaypointStatusEnum.DRAFT && waypointToSave.careerObjective.instructorToBeNotified == false) {
              this.toastService.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.DRAFT_SAVED'));
            } else if (this.waypoint.waypointStatus === WaypointStatusEnum.DRAFT && waypointToSave.careerObjective.instructorToBeNotified == true) {
              this.toastService.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.MANAGER_NOTIFIED'));
            } else {
              this.toastService.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_SAVED'));
            }
            this.navCtrl.pop();
            resolve();
          }).finally(() => {
            loading.dismiss();
          });
      });
    });
  }

  /**
   * Prépare le point d'étape avant de l'envoyer au back :
   * Transforme la date au format iso
   * ou supprime l'entrée de l'objet si la date est nulle
   *
   * @param waypointToSave le point d'étape à enregistrer
   * @return le point d'étape à enregistrer avec la date de rencontre transformée
   */
  prepareWaypointBeforeSubmit(waypointToSave: WaypointModel): WaypointModel {
    if (typeof waypointToSave.encounterDate !== 'undefined' && waypointToSave.encounterDate !== '') {
      waypointToSave.encounterDate = this.dateTransformer.transformDateStringToIso8601Format(waypointToSave.encounterDate);
    } else {
      delete waypointToSave.encounterDate;
    }
    return waypointToSave;
  }

  /**
   * Présente une alerte pour confirmer la suppression du point d'étape
   */
  confirmDeleteWaypoint() {
    this.alertCtrl.create({
      header: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DELETE.TITLE'),
      message: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DELETE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DELETE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_DELETE.CONFIRM'),
          handler: () => this.deleteWaypoint()
        }
      ]
    }).then(alert => alert.present());
  }

  /**
   * Supprime un point d'étape
   */
  deleteWaypoint() {

    this.loadingCtrl.create().then(loading => {
      loading.present();

      this.waypointService
        .delete(this.waypoint.techId)
        .then(
          deletedWaypoint => {
            this.toastService.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_DELETED'));
            this.navCtrl.pop();
            loading.dismiss();
          }, error => {
            loading.dismiss();
          });
    });

  }

  /**
   * Enregistre un point d'étape au statut enregistré
   */
  saveWaypointToRegisteredStatus() {
    if (this.saveActionIsValid()) {
      const waypointToSave = _.cloneDeep(this.waypoint);
      waypointToSave.waypointStatus = WaypointStatusEnum.REGISTERED;
      this.saveWaypoint(waypointToSave);
    } else {
      this.requiredOnEncounterDay = true;
      this.toastService.warning(this.translateService.instant('WAYPOINT_CREATE.ERROR.ENCOUTER_DATE_AND_ACTION_PLAN_REQUIRED'));
    }
  }

  /**
   * Teste l'action de sauvegarde est valide
   * @return vrai si l'action est valide, faux sinon.
   */
  saveActionIsValid() {
    return this.waypoint.actionPerformed && this.waypoint.actionPerformed.length > 0
      && this.waypoint.encounterDate && this.waypoint.encounterDate.length > 0;
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.waypoint !== undefined;
  }

  /**
   * Détermine si le champs peut être modifié par l'utilisateur connecté
   * @return vrai si c'est un champ non modifiable, faux sinon
   */
  readOnlyByUserConnected(): boolean {
    if (this.securityService.isManager()) {
      return false;
    } else if (!this.securityService.isManager() &&
      (this.waypoint.waypointStatus === WaypointStatusEnum.DRAFT ||
        this.waypoint.waypointStatus == null)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Vérifie si le point d'etape peut être enregistré par le pnc
   * @return vrai s'il peut enregistrer le point d'etape , faux sinon
   */
  canPncCommentBeModifiedByPnc(): boolean {
    return !this.securityService.isManager() &&
      (this.waypoint.waypointStatus === WaypointStatusEnum.REGISTERED) &&
      this.waypoint.pncComment !== this.originalPncComment;
  }

  /**
   * Sauvegarde le pont d'etape et met a jour le commentaire pnc du point d'etape original
   */
  saveWaypointAndUpdatePncComment() {
    this.saveWaypoint(this.waypoint).then(() => {
      this.originalPncComment = this.waypoint.pncComment;
    });
  }

  /**
   * Détermine si on peut afficher le statut ou non
   * @return true si on peut, false sinon
   */
  canDisplayStatus(): boolean {
    return this.waypoint.waypointStatus && this.waypoint.waypointStatus === this.WaypointStatus.DRAFT;
  }

  /**
   * Retourne la date de dernière modification, formatée pour l'affichage
   * @return la date de dernière modification
   */
  getLastUpdateDate(): string {
    return this.dateTransformer.formatDateStringInDay(this.waypoint.lastUpdateDate, 'dd/MM/yyyy HH:mm');
  }

}
