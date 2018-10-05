import { DateTransformService } from './../../services/date.transform.service';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { DeviceService } from './../../services/device.service';
import { OfflineCareerObjectiveProvider } from './../../providers/career-objective/offline-career-objective';
import { TransformerService } from './../../services/transformer.service';
import { Entity } from './../../models/entity';
import { StorageService } from './../../services/storage.service';
import { OfflinePncProvider } from './../../providers/pnc/offline-pnc';
import { ConnectivityService } from './../../services/connectivity.service';
import { AppConstant } from './../../app/app.constant';
import { WaypointStatus } from './../../models/waypointStatus';
import { SecurityProvider } from './../../providers/security/security';
import { WaypointProvider } from './../../providers/waypoint/waypoint';
import { Speciality } from './../../models/speciality';
import { CareerObjectiveStatusProvider } from './../../providers/career-objective-status/career-objective-status';
import { ToastProvider } from './../../providers/toast/toast';
import { CareerObjectiveStatus } from './../../models/careerObjectiveStatus';
import { TranslateService } from '@ngx-translate/core';
import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Pnc } from '../../models/pnc';
import { Waypoint } from './../../models/waypoint';
import { WaypointCreatePage } from './../waypoint-create/waypoint-create';
import * as _ from 'lodash';

@Component({
    selector: 'page-career-objective-create',
    templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

    datepickerMaxDate = AppConstant.datepickerMaxDate;

    creationForm: FormGroup;
    careerObjective: CareerObjective;
    originCareerObjective: CareerObjective;
    waypointList: Waypoint[];
    nextEncounterDateTimeOptions: any;
    encounterDateTimeOptions: any;

    loading: Loading;

    cancelValidation = false;
    cancelAbandon = false;

    requiredOnEncounterDay = false;

    originalPncComment: string;

    // Permet d'exposer l'enum au template
    CareerObjectiveStatus = CareerObjectiveStatus;
    WaypointStatus = WaypointStatus;

    monthsNames;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private alertCtrl: AlertController,
        public translateService: TranslateService,
        private formBuilder: FormBuilder,
        private careerObjectiveProvider: CareerObjectiveProvider,
        private waypointProvider: WaypointProvider,
        private toastProvider: ToastProvider,
        public careerObjectiveStatusProvider: CareerObjectiveStatusProvider,
        public securityProvider: SecurityProvider,
        public loadingCtrl: LoadingController,
        private dateTransformer: DateTransformService,
        private connectivityService: ConnectivityService,
        private offlinePncProvider: OfflinePncProvider,
        private offlineCareerObjectiveProvider: OfflineCareerObjectiveProvider,
        private deviceService: DeviceService,
        private synchronizationProvider: SynchronizationProvider) {

        // Options du datepicker
        this.nextEncounterDateTimeOptions = {
            buttons: [{
                text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
                handler: () => this.careerObjective.nextEncounterDate = ''
            }]
        };

        this.encounterDateTimeOptions = {
            buttons: [{
                text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
                handler: () => this.careerObjective.encounterDate = ''
            }]
        };

        // Traduction des mois
        this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

        // Initialisation du formulaire
        this.initForm();

        this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
            if (!synchroInProgress && this.careerObjective && this.careerObjective.techId) {
                this.waypointProvider.getCareerObjectiveWaypoints(this.careerObjective.techId).then(result => {
                    this.waypointList = result;
                }, error => { });
            }
        });
    }

    ionViewDidLoad() {
        // On récupère l'id de l'objectif dans les paramètres de navigation
        if (this.navParams.get('careerObjectiveId') && this.navParams.get('careerObjectiveId') !== '0') {
            // Récupération de l'objectif et des points d'étape
            this.careerObjectiveProvider.getCareerObjective(this.navParams.get('careerObjectiveId')).then(foundCareerObjective => {
                this.originCareerObjective = _.cloneDeep(foundCareerObjective);
                this.careerObjective = foundCareerObjective;
                this.originalPncComment = this.careerObjective.pncComment;
            }, error => { });
            this.waypointProvider.getCareerObjectiveWaypoints(this.navParams.get('careerObjectiveId')).then(result => {
                this.waypointList = result;
            }, error => { });
        } else {
            // Création
            this.careerObjective = new CareerObjective();
            this.careerObjective.pnc = new Pnc();
            this.careerObjective.pnc.matricule = this.navParams.get('matricule');
            this.waypointList = [];
        }
    }

    ionViewDidEnter() {
        if (this.careerObjective && this.careerObjective.techId) {
            this.careerObjectiveProvider.getCareerObjective(this.careerObjective.techId).then(foundCareerObjective => {
                this.originCareerObjective = _.cloneDeep(foundCareerObjective);
                this.careerObjective = foundCareerObjective;
                this.originalPncComment = this.careerObjective.pncComment;
            }, error => { });
            this.waypointProvider.getCareerObjectiveWaypoints(this.careerObjective.techId).then(result => {
                this.waypointList = result;
            }, error => { });
        } else {
            // Création
            this.originCareerObjective = _.cloneDeep(this.careerObjective);
        }
    }

    ionViewCanLeave() {
        if (this.formHasBeenModified()) {
            return new Promise((resolve, reject) => {
                // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
                this.alertCtrl.create({
                    title: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
                    message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE'),
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
        else {
            return true;
        }
    }

    /**
     * Vérifie si le formulaire a été modifié sans être enregistré
     */
    formHasBeenModified() {
        return JSON.stringify(this.originCareerObjective) !== JSON.stringify(this.careerObjective);
    }

    /**
     * Initialise le formulaire
     */
    initForm() {
        this.creationForm = this.formBuilder.group({
            initiatorControl: ['', Validators.required],
            titleControl: ['', Validators.compose([Validators.maxLength(255), Validators.required])],
            contextControl: ['', Validators.maxLength(4000)],
            actionPlanControl: ['', Validators.maxLength(5000)],
            managerCommentControl: ['', Validators.maxLength(4000)],
            pncCommentControl: ['', Validators.maxLength(4000)],
            encounterDateControl: [''],
            nextEncounterDateControl: [''],
            prioritizedControl: [false],
            waypointContextControl: ['', Validators.maxLength(4000)],
        });
    }

    /**
     * Teste si le champs "date de rencontre" est obligatoire
     */
    isEncounterDateRequired(): boolean {
        return (this.careerObjective.careerObjectiveStatus && this.careerObjective.careerObjectiveStatus !== CareerObjectiveStatus.DRAFT);
    }

    /**
     * Lance le processus de création/mise à jour d'un objectif
     * @param careerObjectiveToSave l'objectif à enregistrer
     */
    saveCareerObjective(careerObjectiveToSave: CareerObjective) {
        return new Promise((resolve, reject) => {
            careerObjectiveToSave = this.prepareCareerObjectiveBeforeSubmit(careerObjectiveToSave);

            this.loading = this.loadingCtrl.create();
            this.loading.present();

            this.careerObjectiveProvider
                .createOrUpdate(careerObjectiveToSave)
                .then(savedCareerObjective => {
                    this.originCareerObjective = _.cloneDeep(savedCareerObjective);
                    this.careerObjective = savedCareerObjective;
                    // en mode connecté, mettre en cache l'objectif creé ou modifié si le pnc est en cache
                    if (this.deviceService.isOfflineModeAvailable() && this.connectivityService.isConnected() && this.offlinePncProvider.pncExists(this.careerObjective.pnc.matricule)) {
                        this.offlineCareerObjectiveProvider.createOrUpdate(this.careerObjective, true);
                    }

                    if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.DRAFT) {
                        this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.DRAFT_SAVED'));
                    } else if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.REGISTERED) {
                        if (this.cancelValidation) {
                            this.toastProvider.success
                                (this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_VALIDATION_CANCELED'));
                            this.cancelValidation = false;
                        } else if (this.cancelAbandon) {
                            this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_RESUMED'));
                            this.cancelAbandon = false;
                        } else {
                            this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_SAVED'));
                        }
                    } else if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.VALIDATED) {
                        this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_VALIDATED'));
                    } else if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.ABANDONED) {
                        this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_ABANDONED'));
                    }
                    this.loading.dismiss();
                    resolve();
                }, error => {
                    this.loading.dismiss();
                });
        });
    }

    /**
     * Prépare l'objectif avant de l'envoyer au back :
     * Transforme les dates au format iso
     * @param careerObjectiveToSave
     * @return l'objectif à enregistrer avec la date de rencontre transformée
     */
    prepareCareerObjectiveBeforeSubmit(careerObjectiveToSave: CareerObjective): CareerObjective {
        if (careerObjectiveToSave.encounterDate !== undefined) {
            careerObjectiveToSave.encounterDate = this.dateTransformer.transformDateStringToIso8601Format(careerObjectiveToSave.encounterDate);
        }
        if (careerObjectiveToSave.nextEncounterDate !== undefined) {
            careerObjectiveToSave.nextEncounterDate = this.dateTransformer.transformDateStringToIso8601Format(careerObjectiveToSave.nextEncounterDate);
        }
        return careerObjectiveToSave;
    }

    /**
     * Enregistre un objectif au statut brouillon
     */
    saveCareerObjectiveDraft() {
        const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
        careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatus.DRAFT;
        this.saveCareerObjective(careerObjectiveToSave);
    }

    /**
     * Enregistre un objectif au statut enregistré
     */
    saveCareerObjectiveToRegisteredStatus() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatus.REGISTERED;
            careerObjectiveToSave.registrationDate = this.dateTransformer.transformDateToIso8601Format(new Date());
            this.saveCareerObjective(careerObjectiveToSave);
        } else {
            this.requiredOnEncounterDay = true;
            this.toastProvider.warning(this.translateService.instant('CAREER_OBJECTIVE_CREATE.ERROR.ENCOUTER_DATE_REQUIRED'));
        }
    }

    /**
     * Enregistre un objectif au statut validé
     */
    saveCareerObjectiveToValidatedStatus() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatus.VALIDATED;
            this.saveCareerObjective(careerObjectiveToSave);
        } else {
            this.requiredOnEncounterDay = true;
        }
    }

    /**
    * Enregistre un objectif au statut abandonné
    */
    saveCareerObjectiveToAbandonedStatus() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatus.ABANDONED;
            this.saveCareerObjective(careerObjectiveToSave);
        } else {
            this.requiredOnEncounterDay = true;
        }
    }

    /**
    * annule la validation d'un objectif
    */
    cancelCareerObjectiveValidation() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            this.cancelValidation = true;
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatus.REGISTERED;
            this.saveCareerObjective(careerObjectiveToSave);
        } else {
            this.requiredOnEncounterDay = true;
        }
    }

    /**
    * reprendre un objectif abandonné
    */
    resumeAbandonedCareerObjective() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            this.cancelAbandon = true;
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatus.REGISTERED;
            this.saveCareerObjective(careerObjectiveToSave);
        }
    }

    /**
    * Présente une alerte pour confirmer la suppression du brouillon
    */
    confirmDeleteCareerObjectiveDraft() {
        this.alertCtrl.create({
            title: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.TITLE'),
            message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.CONFIRM'),
                    handler: () => this.deleteCareerObjectiveDraft()
                }
            ]
        }).present();
    }

    /**
    * Supprime un objectif au statut brouillon
    */
    deleteCareerObjectiveDraft() {
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.careerObjectiveProvider
            .delete(this.careerObjective.techId)
            .then(
                deletedCareerObjective => {
                    this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.DRAFT_DELETED'));
                    this.navCtrl.pop();
                    this.loading.dismiss();
                },
                error => {
                    this.loading.dismiss();
                });
    }

    /**
     * Teste si l'objectif est en mode création ou édition
     */
    isCreationMode() {
        return this.careerObjective.techId === undefined;
    }

    /**
     * Dirige vers la page de création d'un point d'étape
     */
    goToWaypointCreate() {
        this.navCtrl.push(WaypointCreatePage, { careerObjectiveId: this.careerObjective.techId, wayPointId: 0 });
    }

    /**
     * Ouvrir un point d'étape existant
     */
    openWaypoint(techId: number) {
        this.navCtrl.push(WaypointCreatePage, { careerObjectiveId: this.careerObjective.techId, waypointId: techId });
    }

    /**
     * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
     */
    createInstructorRequest() {

        this.careerObjectiveProvider
            .createInstructorRequest(this.careerObjective.techId)
            .then(result => {
                this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_INSTRUCTOR_REQUESTED'));
            },
                error => { });
    }


    /**
    * Présente une alerte pour confirmer la suppression du brouillon
    */
    confirmCreateInstructorRequest() {
        this.alertCtrl.create({
            title: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.TITLE'),
            message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.CONFIRM'),
                    handler: () => this.createInstructorRequest()
                }
            ]
        }).present();
    }

    /**
    * Vérifie que le chargement de l'objectif est terminé
    * @return true si c'est le cas, false sinon
    */
    careerObjectiveLoadingIsOver(): boolean {
        return this.careerObjective !== undefined;
    }

    /**
    * Vérifie que le chargement des points d'étape est terminé
    * @return true si c'est le cas, false sinon
    */
    waypointsLoadingIsOver(): boolean {
        return this.waypointList !== undefined;
    }

    /**
       * Détermine si le champs peut être modifié par l'utilisateur connecté
       * @return vrai si c'est un champ modifiable, faux sinon
       */
    readOnlyByUserConnected(): boolean {
        if (this.securityProvider.isManager()) {
            return false;
        } else if (!this.securityProvider.isManager() &&
            (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.DRAFT ||
                this.careerObjective.careerObjectiveStatus == undefined ||
                this.careerObjective.careerObjectiveStatus == null)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Vérifie si l'objectif peut être enregistré par le pnc
     * @return vrai s'il peut enregistrer l'objectif , faux sinon
     */
    canPncCommentBeModifiedByPnc(): boolean {
        return !this.securityProvider.isManager() && (
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.REGISTERED ||
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.VALIDATED ||
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.ABANDONED) &&
            this.careerObjective.pncComment !== this.originalPncComment;
    }

    /**
     * Sauvegarde l'objectif et met a jour le commentaire pnc de l'objectif original
     **/

    saveCareerObjectiveAndUpdatePncComment() {
        this.saveCareerObjective(this.careerObjective).then(() => {
            this.originalPncComment = this.careerObjective.pncComment;
        });
    }

    /**
     * Retourne la classe css de lecture seule pour un champ texte si besoin
     */
    getCssClassForReadOnlyIfNeeded(): string {
        if (this.readOnlyByUserConnected()) {
            return 'ion-textarea-read-only';
        } else {
            return '';
        }
    }

    /**
     * Retourne true si on est connecté / false sinon.
     */
    isConnected() {
        return this.connectivityService.isConnected();
    }
}
