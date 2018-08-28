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
import { Component, NgModule } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Pnc } from '../../models/pnc';
import { DatePipe } from '@angular/common';
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
        private datePipe: DatePipe,
        public securityProvider: SecurityProvider,
        public loadingCtrl: LoadingController) {

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

        // Initialisation du formulaire
        this.initForm();
    }

    ionViewDidLoad() {
        // On récupère l'id de l'objectif dans les paramètres de navigation
        if (this.navParams.get('careerObjectiveId') && this.navParams.get('careerObjectiveId') !== '0') {
            // Récupération de l'objectif et des points d'étape
            this.careerObjectiveProvider.getCareerObjective(this.navParams.get('careerObjectiveId')).then(foundCareerObjective => {
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
                this.careerObjective = foundCareerObjective;
                this.originalPncComment = this.careerObjective.pncComment;
            }, error => { });
            this.waypointProvider.getCareerObjectiveWaypoints(this.careerObjective.techId).then(result => {
                this.waypointList = result;
            }, error => { });
        }
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
     */
    saveCareerObjective(careerObjective: CareerObjective) {
        careerObjective = this.prepareCareerObjectiveBeforeSubmit(careerObjective);

        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.careerObjectiveProvider
            .createOrUpdate(careerObjective)
            .then(savedCareerObjective => {
                this.careerObjective = savedCareerObjective;

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
            }, error => {
                this.loading.dismiss();
            });
    }

    /**
     * Prépare l'objectif avant de l'envoyer au back :
     * Transforme les dates au format iso
     */
    prepareCareerObjectiveBeforeSubmit(careerObjective: CareerObjective): CareerObjective {
        if (careerObjective.encounterDate !== undefined) {
            careerObjective.encounterDate = this.datePipe.transform(this.careerObjective.encounterDate, 'yyyy-MM-ddTHH:mm');
        }
        careerObjective.nextEncounterDate = this.datePipe.transform(this.careerObjective.nextEncounterDate, 'yyyy-MM-ddTHH:mm');
        return careerObjective;
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
            careerObjectiveToSave.registrationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
            this.saveCareerObjective(careerObjectiveToSave);
        } else {
            this.requiredOnEncounterDay = true;
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
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.VALIDATED) &&
            this.careerObjective.pncComment !== this.originalPncComment;
    }

    /**
     * Sauvegarde l'objectif et met a jour le commentaire pnc de l'objectif original
     **/

    saveCareerObjectiveAndUpdatePncComment() {
        this.saveCareerObjective(this.careerObjective);
        this.originalPncComment = this.careerObjective.pncComment;
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
}
