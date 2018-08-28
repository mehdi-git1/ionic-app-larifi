import { AppConstant } from './../../app/app.constant';
import { DatePipe } from '@angular/common';
import { SecurityProvider } from './../../providers/security/security';
import { WaypointStatusProvider } from './../../providers/waypoint-status/waypoint-status';
import { WaypointStatus } from './../../models/waypointStatus';
import { CareerObjective } from './../../models/careerObjective';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { Waypoint } from './../../models/waypoint';
import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { ToastProvider } from './../../providers/toast/toast';

@Component({
    selector: 'page-waypoint-create',
    templateUrl: 'waypoint-create.html',
})
export class WaypointCreatePage {

    datepickerMaxDate = AppConstant.datepickerMaxDate;

    creationForm: FormGroup;
    careerObjectiveId: number;
    waypoint: Waypoint;
    loading: Loading;
    requiredOnEncounterDay: boolean;

    customDateTimeOptions: any;

    originalPncComment: string;

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

        // Options du datepicker
        this.customDateTimeOptions = {
            buttons: [{
                text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
                handler: () => this.waypoint.encounterDate = ''
            }]
        };

        this.requiredOnEncounterDay = false;

        this.initForm();
    }

    ionViewDidEnter() {
        this.careerObjectiveId = this.navParams.get('careerObjectiveId');

        if (this.navParams.get('waypointId') && this.navParams.get('waypointId') !== '0') {
            // Récupération du point d'étape
            this.waypointProvider.getWaypoint(this.navParams.get('waypointId')).then(result => {
                this.waypoint = result;
                this.originalPncComment = this.waypoint.pncComment;
            }, error => { });
        } else {
            // Création
            this.waypoint = new Waypoint();
        }
    }

    /**
     * Initialise le formulaire
     */
    initForm() {
        this.creationForm = this.formBuilder.group({
            contextControl: ['', Validators.compose([Validators.maxLength(4000), Validators.required])],
            actionPerformedControl: ['', Validators.maxLength(5000)],
            managerCommentControl: ['', Validators.maxLength(4000)],
            pncCommentControl: ['', Validators.maxLength(4000)],
            encounterDateControl: [''],
        });
    }

    /**
     * Teste si le point d'étape est un brouillon.
     * @return true si le point d'étape est un brouillon, false sinon.
     */
    isDraft(): boolean {
        return !this.waypoint.waypointStatus || this.waypoint.waypointStatus === WaypointStatus.DRAFT;
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
        this.prepareWaypointBeforeSubmit();

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
     * Prépare le point d'étape avant de l'envoyer au back :
     * Transforme les dates au format iso
     */
    prepareWaypointBeforeSubmit() {
        if (this.waypoint.encounterDate) {
            this.waypoint.encounterDate = this.datePipe.transform(this.waypoint.encounterDate, 'yyyy-MM-ddTHH:mm');
        }
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
        if (this.saveActionIsValid()) {
            this.waypoint.waypointStatus = WaypointStatus.REGISTERED;
            this.saveWaypoint();
        } else {
            this.requiredOnEncounterDay = true;
            this.toastProvider.warning(this.translateService.instant('WAYPOINT_CREATE.ERROR.ENCOUTER_DATE_AND_ACTION_PLAN_REQUIRED'));
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
        if (this.securityProvider.isManager()) {
            return false;
        } else if (!this.securityProvider.isManager() &&
            (this.waypoint.waypointStatus === WaypointStatus.DRAFT ||
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
        return !this.securityProvider.isManager() && (
            this.waypoint.waypointStatus === WaypointStatus.REGISTERED) &&
            this.waypoint.pncComment !== this.originalPncComment;
    }

    /**
     * Sauvegarde le pont d'etape et met a jour le commentaire pnc du point d'etape original
     */
    saveWaypointAndUpdatePncComment() {
        this.saveWaypoint();
        this.originalPncComment = this.waypoint.pncComment;
    }

}
