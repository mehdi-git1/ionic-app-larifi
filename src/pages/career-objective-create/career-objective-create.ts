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
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Pnc } from '../../models/pnc';
import { DatePipe } from '@angular/common';
import { Waypoint } from './../../models/waypoint';
import { WaypointCreatePage } from './../waypoint-create/waypoint-create';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;
  waypointList: Waypoint[];
  nextEncounterDateTimeOptions: any;
  encounterDateTimeOptions: any;

  loading: Loading;

  cancelValidation = false;
  cancelAbandon = false;

  requiredOnEncounterDay = false;

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

    this.careerObjective = new CareerObjective();
    this.careerObjective.pnc = new Pnc();

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
    // On récupère le matricule du pnc de la route
    if (this.navParams.get('matricule')) {
      this.careerObjective.pnc.matricule = this.navParams.get('matricule');
    }
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      // On récupère l'id de l'objectif dans les paramètres de navigation
      if (this.navParams.get('careerObjectiveId')) {
        this.careerObjective.techId = this.navParams.get('careerObjectiveId');
      } else {
        resolve();
      }

      // Récupération de l'objectif et des points d'étape
      if (this.careerObjective.techId) {
        this.careerObjectiveProvider.getCareerObjective(this.careerObjective.techId).then(foundCareerObjective => {
          this.careerObjective = foundCareerObjective;
        }, error => {
          reject();
        });

        this.waypointProvider.getCareerObjectiveWaypoints(this.careerObjective.techId).then(result => {
          this.waypointList = result;
          resolve();
        }, error => {
          reject();
        });
      }
    });
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
  saveCareerObjective() {
    this.prepareCareerObjectiveBeforeSubmit();

    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.careerObjectiveProvider
      .createOrUpdate(this.careerObjective)
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
  prepareCareerObjectiveBeforeSubmit() {
    if (this.careerObjective.encounterDate !== undefined) {
      this.careerObjective.encounterDate = this.datePipe.transform(this.careerObjective.encounterDate, 'yyyy-MM-ddTHH:mm');
    }
    this.careerObjective.nextEncounterDate = this.datePipe.transform(this.careerObjective.nextEncounterDate, 'yyyy-MM-ddTHH:mm');
  }

  /**
   * Enregistre un objectif au statut brouillon
   */
  saveCareerObjectiveDraft() {
    this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.DRAFT;
    this.saveCareerObjective();
  }

  /**
   * Enregistre un objectif au statut enregistré
   */
  saveCareerObjectiveToRegisteredStatus() {
    if (this.careerObjective.encounterDate) {
      this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.REGISTERED;
      this.careerObjective.registrationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
      this.saveCareerObjective();
    } else {
      this.requiredOnEncounterDay = true;
    }
  }

  /**
   * Enregistre un objectif au statut validé
   */
  saveCareerObjectiveToValidatedStatus() {
    if (this.careerObjective.encounterDate) {
      this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.VALIDATED;
      this.saveCareerObjective();
    } else {
      this.requiredOnEncounterDay = true;
    }
  }

  /**
  * Enregistre un objectif au statut abandonné
  */
  saveCareerObjectiveToAbandonedStatus() {
    if (this.careerObjective.encounterDate) {
      this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.ABANDONED;
      this.saveCareerObjective();
    } else {
      this.requiredOnEncounterDay = true;
    }
  }

  /**
  * annule la validation d'un objectif
  */
  cancelCareerObjectiveValidation() {
    if (this.careerObjective.encounterDate) {
      this.cancelValidation = true;
      this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.REGISTERED;
      this.saveCareerObjective();
    } else {
      this.requiredOnEncounterDay = true;
    }
  }

  /**
  * reprendre un objectif abandonné
  */
  resumeAbandonedCareerObjective() {
    if (this.careerObjective.encounterDate) {
      this.cancelAbandon = true;
      this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.REGISTERED;
      this.saveCareerObjective();
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
    this.navCtrl.push(WaypointCreatePage, { careerObjectiveId: this.careerObjective.techId });
  }

  /**
   * Ouvrir un point d'étape existant
   */
  openWaypoint(techId: number) {
    this.navCtrl.push(WaypointCreatePage, { waypointId: techId, careerObjectiveId: this.careerObjective.techId });
  }

  /**
   * Envoi au serveur une demande de sollicitation instructeur pour l'objectif
   */
  createRequestInstructor() {
    this.careerObjectiveProvider
      .createRequestInstructor(this.careerObjective.techId);
    this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_INSTRUCTOR_REQUESTED'));
  }
}
