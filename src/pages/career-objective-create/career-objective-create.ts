import { Speciality } from './../../models/speciality';
import { CareerObjectiveStatusProvider } from './../../providers/career-objective-status/career-objective-status';
import { ToastProvider } from './../../providers/toast/toast';
import { CareerObjectiveStatus } from './../../models/careerObjectiveStatus';
import { TranslateService } from '@ngx-translate/core';
import { CareerObjectiveProvider } from './../../providers/career-objective/career-objective';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pnc } from '../../models/pnc';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-career-objective-create',
  templateUrl: 'career-objective-create.html',
})
export class CareerObjectiveCreatePage {

  creationForm: FormGroup;
  careerObjective: CareerObjective;

  customDateTimeOptions: any;
  saveInProgress: boolean;

  // Permet d'exposer l'enum au template
  CareerObjectiveStatus: typeof CareerObjectiveStatus = CareerObjectiveStatus;

  // Exporter un objet de la classe enum dans la template
  Speciality = Speciality;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translateService: TranslateService,
    private formBuilder: FormBuilder,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastProvider: ToastProvider,
    public careerObjectiveStatusProvider: CareerObjectiveStatusProvider,
    private datePipe: DatePipe) {

    this.careerObjective = new CareerObjective();
    this.careerObjective.pnc = new Pnc();

    // Initialisation du formulaire
    this.creationForm = this.formBuilder.group({
      pncMatriculeControl: ['', Validators.required],
      initiatorControl: ['', Validators.required],
      titleControl: ['', Validators.compose([Validators.maxLength(255), Validators.required])],
      contextControl: ['', Validators.maxLength(4000)],
      actionPlanControl: ['', Validators.maxLength(5000)],
      managerCommentControl: ['', Validators.maxLength(4000)],
      pncCommentControl: ['', Validators.maxLength(4000)],
      nextEncounterDateControl: [''],
      prioritizedControl: [false]
    });

    // Options du datepicker
    this.customDateTimeOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.careerObjective.nextEncounterDate = ''
      }]
    };

    this.saveInProgress = false;
  }

  ionViewDidLoad() {
  }

  /**
   * Lance le processus de création/mise à jour d'un objectif
   */
  saveCareerObjective() {
    // Transformation de la date au format ISO avant envoi au back
    this.careerObjective.nextEncounterDate = this.datePipe.transform(this.careerObjective.nextEncounterDate, 'yyyy-MM-ddTHH:mm');

    this.saveInProgress = true;
    this.careerObjectiveProvider
      .createOrUpdate(this.careerObjective)
      .then(savedCareerObjective => {
        this.careerObjective = savedCareerObjective;
        this.saveInProgress = false;

        if (this.careerObjective.careerObjectiveStatus === CareerObjectiveStatus.DRAFT) {
          this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.DRAFT_SAVED'));
        } else {
          this.toastProvider.success(this.translateService.instant('CAREER_OBJECTIVE_CREATE.SUCCESS.CAREER_OBJECTIVE_SAVED'));
        }
      }, error => {
        this.saveInProgress = false;
        this.toastProvider.error(error.detailMessage);
      });
  }

  /**
   * Enregistre un objectif au statut brouillon
   */
  saveCareerObjectiveDraft() {
    this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.DRAFT;
    this.saveCareerObjective();
  }

  /**
   * Enregistre un objectif au statut enregistrer
   */
  createCareerObjectiveRegister() {
    this.careerObjective.careerObjectiveStatus = CareerObjectiveStatus.REGISTER;
    this.saveCareerObjective();
  }
}
