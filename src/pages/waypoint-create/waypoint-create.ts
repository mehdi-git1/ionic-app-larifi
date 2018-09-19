import { DateTransformService } from './../../services/date.transform.service';
import { AppConstant } from './../../app/app.constant';
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
import * as _ from 'lodash';
import { DeviceService } from '../../services/device.service';

@Component({
    selector: 'page-waypoint-create',
    templateUrl: 'waypoint-create.html',
})
export class WaypointCreatePage {

    datepickerMaxDate = AppConstant.datepickerMaxDate;

    creationForm: FormGroup;
    careerObjectiveId: number;
    waypoint: Waypoint;
    originWaypoint: Waypoint;
    loading: Loading;
    requiredOnEncounterDay: boolean;

    customDateTimeOptions: any;

    originalPncComment: string;

    monthsNames;

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
        public securityProvider: SecurityProvider,
        public loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private deviceService: DeviceService,
        private dateTransformer: DateTransformService) {

        // Options du datepicker
        this.customDateTimeOptions = {
            buttons: [{
                text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
                handler: () => this.waypoint.encounterDate = ''
            }]
        };

        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

        this.requiredOnEncounterDay = false;

        this.initForm();
    }


    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        this.careerObjectiveId = this.navParams.get('careerObjectiveId');

        if (this.navParams.get('waypointId') && this.navParams.get('waypointId') !== 0) {
            // Récupération du point d'étape
            this.waypointProvider.getWaypoint(this.navParams.get('waypointId')).then(waypoint => {
                this.originWaypoint = _.cloneDeep(waypoint);
                this.waypoint = waypoint;
                this.originalPncComment = this.waypoint.pncComment;
            }, error => { });
        } else {
            // Création
            this.waypoint = new Waypoint();
            this.waypoint.careerObjective = new CareerObjective();
            this.waypoint.careerObjective.techId = this.careerObjectiveId;
            this.originWaypoint = _.cloneDeep(this.waypoint);
        }
    }

    public ionViewWillLeave() {
        this.navCtrl.getPrevious().data.careerObjectiveId = this.careerObjectiveId;
    }
    /**
     * Verifie si des modifications ont été faites, avant d'initialiser le contenu de la page.
     * si oui, on affiche une popup de confirmation d'abandon des modifications
     * si non, on initialise la page.
     */
    refreshPage() {
        if (this.formHasBeenModified()) {
            this.confirmAbandonChanges().then(() => {
                this.creationForm.reset();
                this.initPage();
            }, error => {

            });
        } else {
            this.initPage();
        }
    }

    ionViewCanLeave() {
        if (this.formHasBeenModified()) {
            return this.confirmAbandonChanges();
        } else {
            return true;
        }
    }

    /**
     * Popup d'avertissement en cas de modifications non enregistrées.
     */
    confirmAbandonChanges() {
        return new Promise((resolve, reject) => {
            // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
            this.alertCtrl.create({
                title: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
                message: this.translateService.instant('WAYPOINT_CREATE.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE'),
                buttons: [
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
                        role: 'cancel',
                        handler: () => reject()
                    },
                    {
                        text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
                        handler: () => resolve()
                    }
                ]
            }).present();
        });
    }

    /**
     * Vérifie si le formulaire a été modifié sans être enregistré
     */
    formHasBeenModified() {
        return JSON.stringify(this.originWaypoint) !== JSON.stringify(this.waypoint);
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
        const waypointToSave = _.cloneDeep(this.waypoint);
        waypointToSave.waypointStatus = WaypointStatus.DRAFT;
        this.saveWaypoint(waypointToSave);
    }

    /**
     * Lance le processus de création/mise à jour d'un point d'étape
     * @param waypointToSave le point d'étape à enregistrer
     */
    saveWaypoint(waypointToSave: Waypoint) {
        return new Promise((resolve, reject) => {
            waypointToSave = this.prepareWaypointBeforeSubmit(waypointToSave);

            this.loading = this.loadingCtrl.create();
            this.loading.present();

            this.waypointProvider
                .createOrUpdate(waypointToSave, this.careerObjectiveId)
                .then(savedWaypoint => {
                    this.originWaypoint = _.cloneDeep(savedWaypoint);
                    this.waypoint = savedWaypoint;

                    if (this.waypoint.waypointStatus === WaypointStatus.DRAFT) {
                        this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.DRAFT_SAVED'));
                    } else {
                        this.toastProvider.success(this.translateService.instant('WAYPOINT_CREATE.SUCCESS.WAYPOINT_SAVED'));
                    }
                    this.loading.dismiss();
                    this.navCtrl.pop();
                    resolve();
                }, error => {
                    this.loading.dismiss();
                });
        });
    }

    /**
     * Prépare le point d'étape avant de l'envoyer au back :
     * Transforme les dates au format iso
     *
     * @param waypointToSave le point d'étape à enregistrer
     * @return le point d'étape à enregistrer avec la date de rencontre transformée
     */
    prepareWaypointBeforeSubmit(waypointToSave: Waypoint): Waypoint {
        if (waypointToSave.encounterDate) {
            waypointToSave.encounterDate = this.dateTransformer.transformDateStringToIso8601Format(waypointToSave.encounterDate);
        }
        return waypointToSave;
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
            const waypointToSave = _.cloneDeep(this.waypoint);
            waypointToSave.waypointStatus = WaypointStatus.REGISTERED;
            this.saveWaypoint(waypointToSave);
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
        return !this.securityProvider.isManager() &&
            (this.waypoint.waypointStatus === WaypointStatus.REGISTERED) &&
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

}
