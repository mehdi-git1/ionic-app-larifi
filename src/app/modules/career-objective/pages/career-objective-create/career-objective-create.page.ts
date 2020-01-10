import * as _ from 'lodash';
import { PncRoleEnum } from 'src/app/core/enums/pnc-role.enum';

import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { CareerObjectiveStatusEnum } from '../../../../core/enums/career-objective-status.enum';
import { WaypointStatusEnum } from '../../../../core/enums/waypoint.status.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { WaypointModel } from '../../../../core/models/waypoint.model';
import {
    CareerObjectiveStatusService
} from '../../../../core/services/career-objective-status/career-objective-status.service';
import {
    CareerObjectiveService
} from '../../../../core/services/career-objective/career-objective.service';
import {
    OfflineCareerObjectiveService
} from '../../../../core/services/career-objective/offline-career-objective.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { OfflinePncService } from '../../../../core/services/pnc/offline-pnc.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { WaypointService } from '../../../../core/services/waypoint/waypoint.service';
import { FormCanDeactivate } from '../../../../routing/guards/form-changes.guard';
import { DateTransform } from '../../../../shared/utils/date-transform';

@Component({
    selector: 'page-career-objective-create',
    templateUrl: 'career-objective-create.page.html',
    styleUrls: ['./career-objective-create.page.scss']
})
export class CareerObjectiveCreatePage extends FormCanDeactivate {

    creationForm: FormGroup;
    careerObjective: CareerObjectiveModel;
    originCareerObjective: CareerObjectiveModel;
    waypointList: WaypointModel[];

    cancelValidation = false;
    cancelAbandon = false;

    requiredOnEncounterDay = false;

    originalPncComment: string;

    pnc: PncModel;

    // Permet d'exposer l'enum au template
    CareerObjectiveStatus = CareerObjectiveStatusEnum;
    WaypointStatus = WaypointStatusEnum;

    @ViewChild('form', { static: false }) form: NgForm;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        public translateService: TranslateService,
        private formBuilder: FormBuilder,
        private careerObjectiveService: CareerObjectiveService,
        private waypointService: WaypointService,
        private toastService: ToastService,
        public careerObjectiveStatusService: CareerObjectiveStatusService,
        public securityService: SecurityService,
        public loadingCtrl: LoadingController,
        private dateTransformer: DateTransform,
        private connectivityService: ConnectivityService,
        private offlinePncService: OfflinePncService,
        private offlineCareerObjectiveService: OfflineCareerObjectiveService,
        private deviceService: DeviceService,
        private synchronizationService: SynchronizationService,
        private sessionService: SessionService,
        private pncService: PncService,
        private datePipe: DatePipe) {
        super();
        // Initialisation du formulaire
        this.initForm();

        this.synchronizationService.synchroStatusChange.subscribe(synchroInProgress => {
            if (!synchroInProgress && this.careerObjective && this.careerObjective.techId) {
                this.refreshWaypoints(this.careerObjective.techId);
            }
        });
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        // On récupère l'id de l'objectif dans les paramètres de navigation
        if (this.activatedRoute.snapshot.paramMap.get('careerObjectiveId')
            && parseInt(this.activatedRoute.snapshot.paramMap.get('careerObjectiveId'), 10) !== 0) {
            const careerObjectiveId = parseInt(this.activatedRoute.snapshot.paramMap.get('careerObjectiveId'), 10);
            // Récupération de l'objectif et des points d'étape
            this.careerObjectiveService.getCareerObjective(careerObjectiveId)
                .then(foundCareerObjective => {
                    this.originCareerObjective = _.cloneDeep(foundCareerObjective);
                    this.careerObjective = foundCareerObjective;
                    this.originalPncComment = this.careerObjective.pncComment;

                    this.pncService.getPnc(foundCareerObjective.pnc.matricule).then(pnc => {
                        this.pnc = pnc;
                    });
                }, error => { });
            this.refreshWaypoints(careerObjectiveId);
        } else {
            const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
            this.pncService.getPnc(matricule).then(pnc => {
                this.pnc = pnc;
            }, error => { });

            // Création
            this.careerObjective = new CareerObjectiveModel();
            this.careerObjective.pnc = new PncModel();
            this.careerObjective.pnc.matricule = matricule;
            this.careerObjective.initiator = this.sessionService.getActiveUser().isManager ? PncRoleEnum.MANAGER : PncRoleEnum.PNC;
            this.waypointList = [];
            this.originCareerObjective = _.cloneDeep(this.careerObjective);
        }
    }

    /**
     * Réfraichit les points d'étape
     * @param careerObjectiveId identifiant de la priorité
     */
    refreshWaypoints(careerObjectiveId: number) {
        this.waypointService.getCareerObjectiveWaypoints(careerObjectiveId)
            .then(result => {
                this.waypointList = result;
            }, error => { });
    }
    /**
     * Verifie si des modifications ont été faites, avant d'initialiser le contenu de la page.
     * si oui, on affiche une popup de confirmation d'abandon des modifications
     * si non, on initialise la page.
     */
    refreshPage() {
        if (this.careerObjective && this.careerObjective.techId) {
            this.refreshWaypoints(this.careerObjective.techId);
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
        return (this.careerObjective.careerObjectiveStatus
            && this.careerObjective.careerObjectiveStatus !== CareerObjectiveStatusEnum.DRAFT);
    }

    /**
     * Lance le processus de création/mise à jour d'un objectif
     * @param careerObjectiveToSave l'objectif à enregistrer
     */
    saveCareerObjective(careerObjectiveToSave: CareerObjectiveModel) {
        return new Promise((resolve, reject) => {
            careerObjectiveToSave = this.prepareCareerObjectiveBeforeSubmit(careerObjectiveToSave);

            this.loadingCtrl.create().then(loading => {
                loading.present();

                this.careerObjectiveService
                    .createOrUpdate(careerObjectiveToSave)
                    .then(savedCareerObjective => {
                        this.originCareerObjective = _.cloneDeep(savedCareerObjective);
                        // en mode connecté, mettre en cache l'objectif creé ou modifié si le pnc est en cache
                        if (this.deviceService.isOfflineModeAvailable()
                            && this.connectivityService.isConnected()
                            && this.offlinePncService.pncExists(savedCareerObjective.pnc.matricule)) {
                            this.offlineCareerObjectiveService.createOrUpdate(savedCareerObjective, true);
                        }
                        if (savedCareerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT) {
                            if (this.careerObjective.instructorToBeNotified) {
                                this.toastService.success(
                                    this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_INSTRUCTOR_REQUESTED'));
                            } else {
                                this.toastService.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.DRAFT_SAVED'));
                            }
                        } else if (savedCareerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.REGISTERED) {
                            if (this.cancelValidation) {
                                this.toastService.success
                                    (this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_VALIDATION_CANCELED'));
                                this.cancelValidation = false;
                            } else if (this.cancelAbandon) {
                                this.toastService.success(
                                    this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_RESUMED'));
                                this.cancelAbandon = false;
                            } else if (!careerObjectiveToSave.techId
                                || this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT) {
                                this.toastService.success(
                                    this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_SAVED'));
                            } else {
                                this.toastService.success(
                                    this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_UPDATED'));
                            }
                        } else if (savedCareerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.VALIDATED) {
                            this.toastService.success(
                                this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_VALIDATED'));
                        } else if (savedCareerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.ABANDONED) {
                            this.toastService.success(
                                this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_ABANDONED'));
                        }
                        this.careerObjective = savedCareerObjective;
                        loading.dismiss();
                        this.creationForm.markAsPristine();
                        resolve();
                    }, error => {
                        loading.dismiss();
                    });
            });
        });
    }

    /**
     * Prépare l'objectif avant de l'envoyer au back :
     * Transforme les dates au format iso
     * ou supprime l'entrée de l'objet si une ou plusieurs dates sont nulles
     *
     * @param careerObjectiveToSave la priorité à sauvegarder
     * @return l'objectif à enregistrer avec la date de rencontre transformée
     */
    prepareCareerObjectiveBeforeSubmit(careerObjectiveToSave: CareerObjectiveModel): CareerObjectiveModel {
        if (typeof careerObjectiveToSave.encounterDate !== 'undefined' && careerObjectiveToSave.encounterDate !== '') {
            careerObjectiveToSave.encounterDate =
                this.dateTransformer.transformDateStringToIso8601Format(careerObjectiveToSave.encounterDate);
        } else {
            delete (careerObjectiveToSave.encounterDate);
        }
        if (typeof careerObjectiveToSave.nextEncounterDate !== 'undefined' && careerObjectiveToSave.nextEncounterDate !== '') {
            careerObjectiveToSave.nextEncounterDate =
                this.dateTransformer.transformDateStringToIso8601Format(careerObjectiveToSave.nextEncounterDate);
        } else {
            delete (careerObjectiveToSave.nextEncounterDate);
        }
        return careerObjectiveToSave;
    }

    /**
     * Enregistre un objectif au statut brouillon
     */
    saveCareerObjectiveDraft() {
        const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
        careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatusEnum.DRAFT;
        this.saveCareerObjective(careerObjectiveToSave).then(() => {
            if (careerObjectiveToSave.techId === undefined) {
                this.navCtrl.pop();
            }
        });
    }

    /**
     * Enregistre un objectif au statut enregistré
     */
    saveCareerObjectiveToRegisteredStatus() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatusEnum.REGISTERED;
            careerObjectiveToSave.registrationDate = this.dateTransformer.transformDateToIso8601Format(new Date());
            this.saveCareerObjective(careerObjectiveToSave).then(() => {
                if (careerObjectiveToSave.techId === undefined) {
                    this.navCtrl.pop();
                }
            });
        } else {
            this.requiredOnEncounterDay = true;
            this.toastService.warning(this.translateService.instant('CAREER_OBJECTIVE_CREATE.ERROR.ENCOUTER_DATE_REQUIRED'));
        }
    }

    /**
     * Enregistre un objectif au statut validé
     */
    saveCareerObjectiveToValidatedStatus() {
        if (this.careerObjective.encounterDate) {
            const careerObjectiveToSave = _.cloneDeep(this.careerObjective);
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatusEnum.VALIDATED;
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
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatusEnum.ABANDONED;
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
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatusEnum.REGISTERED;
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
            careerObjectiveToSave.careerObjectiveStatus = CareerObjectiveStatusEnum.REGISTERED;
            this.saveCareerObjective(careerObjectiveToSave);
        }
    }

    /**
     * Présente une alerte pour confirmer la suppression de la priorité
     */
    confirmDeleteCareerObjective() {
        if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT) {
            this.confirmDelete(this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.TITLE'),
                this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.MESSAGE'),
                this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.CANCEL'),
                this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DRAFT_DELETE.CONFIRM'));
        } else {
            this.confirmDelete(this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DELETE.TITLE'),
                this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DELETE.MESSAGE'),
                this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DELETE.CANCEL'),
                this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_DELETE.CONFIRM'));
        }
    }

    /**
     * Présente une alerte pour confirmer la suppression de la priorité
     */
    confirmDelete(title: string, message: string, cancelLabel: string, confirmLabel: string) {
        this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: cancelLabel,
                    role: 'cancel'
                },
                {
                    text: confirmLabel,
                    handler: () => this.deleteCareerObjective()
                }
            ]
        }).then(alert => alert.present());
    }

    /**
     * Supprime un objectif
     */
    deleteCareerObjective() {
        this.loadingCtrl.create().then(loading => {
            loading.present();

            this.careerObjectiveService
                .delete(this.careerObjective.techId)
                .then(deletedCareerObjective => {
                    if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT) {
                        this.toastService.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.DRAFT_DELETED'));
                    } else {
                        this.toastService.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.DELETED'));
                    }
                    this.navCtrl.pop();
                    loading.dismiss();
                }, error => {
                    loading.dismiss();
                });
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
        this.router.navigate(['../..', 'waypoint', this.careerObjective.techId, 0],
            { relativeTo: this.activatedRoute });
    }

    /**
     * Ouvrir un point d'étape existant
     */
    openWaypoint(techId: number) {
        this.router.navigate(['../..', 'waypoint', this.careerObjective.techId, techId],
            { relativeTo: this.activatedRoute });
    }

    /**
     * Présente une alerte pour la notification du brouillon
     */
    confirmCreateInstructorRequest() {
        this.alertCtrl.create({
            header: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.TITLE'),
            message: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.MESSAGE'),
            buttons: [
                {
                    text: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.CANCEL'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('CAREER_OBJECTIVE_CREATE.CONFIRM_INSTRUCTOR_REQUEST.CONFIRM'),
                    handler: () => this.saveCareerObjectiveDraftWithNotification()
                }
            ]
        }).then(alert => alert.present());
    }

    /**
     * Sauvegarde le brouillon, tout en envoyant une notification à l'instructeur
     */
    saveCareerObjectiveDraftWithNotification() {
        this.careerObjective.instructorToBeNotified = true;
        this.saveCareerObjectiveDraft();
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
     * @return Vrai si c'est un champ non modifiable, faux sinon
     */
    readOnlyByUserConnected(): boolean {
        if (this.securityService.isManager()) {
            return false;
        } else if (!this.securityService.isManager() &&
            (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT ||
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
        return !this.securityService.isManager() && (
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.REGISTERED ||
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.VALIDATED ||
            this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.ABANDONED) &&
            this.careerObjective.pncComment !== this.originalPncComment;
    }

    /**
     * Sauvegarde l'objectif et met a jour le commentaire pnc de l'objectif original
     */

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

    /**
     * Retourne true si c'est un brouillon et qu'il peut être supprimé par le user connecté
     * @return true si Draft && (CADRE ou auteur du brouillon)
     */
    isDraftAndCanBeDeleted(): boolean {
        const isInitiatorOrCadre: boolean = this.securityService.isManager()
            || (this.careerObjective.creationAuthor
                && (this.careerObjective.creationAuthor.matricule === this.sessionService.getActiveUser().matricule));
        return this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT && isInitiatorOrCadre;
    }

    /**
     * Vérifie que la fonction de suppression est disponible. C'est le cas si la priorité a dépassé 
     * le statut brouillon et que l'utilisateur est cadre.
     * @return vrai la priorité peut être supprimée
     */
    canBeDeleted(): boolean {
        return this.careerObjective.careerObjectiveStatus
            && this.careerObjective.careerObjectiveStatus !== CareerObjectiveStatusEnum.DRAFT
            && this.securityService.isManager();
    }

    /**
     * Retourne true si c'est un brouillon et qu'il peut être modifié par le user connecté
     * @return true si Draft && (CADRE ou auteur du brouillon ou Pnc concerné)
     */
    isDraftAndCanBeModified(): boolean {
        const canBeSavedAsDraft: boolean = this.careerObjectiveStatusService.isTransitionOk(this.careerObjective.careerObjectiveStatus, CareerObjectiveStatusEnum.DRAFT);
        const isInitiatorOrCadre: boolean = this.securityService.isManager() || (!this.careerObjective.creationAuthor || (this.careerObjective.creationAuthor.matricule === this.sessionService.getActiveUser().matricule));
        const isConcernedPnc = this.careerObjective.pnc && this.careerObjective.pnc.matricule === this.sessionService.getActiveUser().matricule;
        return canBeSavedAsDraft && (isInitiatorOrCadre || isConcernedPnc) && (!this.careerObjective.careerObjectiveStatus || this.careerObjective.careerObjectiveStatus === CareerObjectiveStatusEnum.DRAFT);
    }


    /**
     * Retourne la date de création, formatée pour l'affichage
     * @return la date de création
     */
    getCreationDate(): string {
        return this.datePipe.transform(this.careerObjective.creationDate, 'dd/MM/yyyy HH:mm');
    }


    /**
     * Retourne la date de dernière modification, formatée pour l'affichage
     * @return la date de dernière modification
     */
    getLastUpdateDate(): string {
        return this.datePipe.transform(this.careerObjective.lastUpdateDate, 'dd/MM/yyyy HH:mm');
    }
}
