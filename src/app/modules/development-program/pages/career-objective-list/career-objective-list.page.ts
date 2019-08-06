import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { Component } from '@angular/core';

import { AppConstant } from '../../../../app.constant';
import { EFormsTypeEnum } from '../../../../core/enums/e-forms/e-forms-type.enum';
import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import {
    ProfessionalInterviewStateEnum
} from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { FormsInputParamsModel } from '../../../../core/models/forms-input-params.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { RotationModel } from '../../../../core/models/rotation.model';
import {
    CareerObjectiveService
} from '../../../../core/services/career-objective/career-objective.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import {
    FormsEObservationService
} from '../../../../core/services/forms/forms-e-observation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';
import {
    EObservationsArchivesPage
} from '../../../eobservation/pages/eobservations-archives/eobservations-archives.page';
import {
    ProfessionalInterviewDetailsPage
} from '../../../professional-interview/pages/professional-interview-details/professional-interview-details.page';
import {
    ProfessionalInterviewsArchivesPage
} from '../../../professional-interview/pages/professional-interviews-archives/professional-interviews-archives.page';
import { CareerObjectiveCreatePage } from '../career-objective-create/career-objective-create.page';

@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.page.html',
})
export class CareerObjectiveListPage {

  careerObjectives: CareerObjectiveModel[];
  matricule: string;
  formsInputParam: FormsInputParamsModel;
  lastConsultedRotation: RotationModel;

  canDisplayMenu = false;

  eObservations: EObservationModel[];

  professionalInterviews: ProfessionalInterviewModel[];

  // Expose l'enum au template
  EObservationDisplayModeEnum = EObservationDisplayModeEnum;
  TabHeaderEnum = TabHeaderEnum;

  // Liste des eForms possible
  eFormsList = [];

  // Nombre max de non draft à afficher
  maxNoDraftToDisplay = 3;

  chosenEFormsType = null;

  pnc: PncModel;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private securityService: SecurityService,
    private careerObjectiveService: CareerObjectiveService,
    private professionalInterviewService: ProfessionalInterviewService,
    private formsEObservationService: FormsEObservationService,
    private deviceService: DeviceService,
    private eObservationService: EObservationService,
    private sessionService: SessionService,
    private synchronizationProvider: SynchronizationService,
    private pncService: PncService) {
    this.lastConsultedRotation = this.sessionService.appContext.lastConsultedRotation;
    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      if (!synchroInProgress) {
        this.getEObservationsList();
        this.initCareerObjectivesList();
      }
    });
  }

  ionViewDidEnter() {
    this.matricule = this.sessionService.getActiveUser().matricule;
    this.pncService.getPnc(this.matricule).then(pnc => {
      this.pnc = pnc;
    }, error => { });
    this.getEObservationsList();
    this.initCareerObjectivesList();
    this.getProfessionalInterviewList();
  }

  /**
   * Retourne le texte du type de formulaire pour la création d'EObs
   * @return retourne la valeur du type de formulaire
   */
  getEObsTextTypeEForm(): string {
    return EFormsTypeEnum.getTextType(SpecialityEnum[this.pnc.currentSpeciality]);
  }

  /**
   * Vérifie si le type de formulaire est géré
   * @return true si il est géré, sinon false
   */
  hasEObsTypeForm(): boolean {
    return this.getEObsTextTypeEForm() != undefined;
  }

  /**
   * Récupére la liste des eObservations
   */
  getEObservationsList() {
    this.eObservationService.getEObservations(this.matricule).then(
      eobs => {
        this.eObservations = this.sortEObsByRotationDate(eobs);
      }, error => {
      });
  }

  /**
   * Trie la liste des eObservations par date de rotation
   * @param eObservations liste de eObservations
   * @return liste de eObservations triées
   */
  sortEObsByRotationDate(eObservations: EObservationModel[]): EObservationModel[] {
    return eObservations.sort((eObs1, eObs2) =>
      moment(eObs1.rotationDate, AppConstant.isoDateFormat).isAfter(moment(eObs2.rotationDate, AppConstant.isoDateFormat)) ? -1 : 1);
  }

  /**
   * Dirige vers la page de création d'un nouveau bilan professionnel
   */
  goToProfessionalInterviewCreation() {
    this.navCtrl.push(ProfessionalInterviewDetailsPage, { matricule: this.matricule });
  }

  /**
   * Récupére la liste des bilans professionnels
   */
  getProfessionalInterviewList() {
    this.professionalInterviewService.getProfessionalInterviews(this.matricule).then(
      professionalInterviews => {
        this.professionalInterviews = this.sortProfessionalInterviewsByAnnualProfessionalInterviewDate(professionalInterviews);

        // On ne récupére que les Draft et les 3 derniers autres bilan
        let nbOfNoDraft = 0;
        const tmpProfessionalInterviewsTab = [];
        this.professionalInterviews.forEach((professionalInterview: ProfessionalInterviewModel) => {
          if (professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT || nbOfNoDraft < this.maxNoDraftToDisplay) {
            tmpProfessionalInterviewsTab.push(professionalInterview);
            if (professionalInterview.state !== ProfessionalInterviewStateEnum.DRAFT) {
              nbOfNoDraft++;
            }
          }
        });
        this.professionalInterviews = tmpProfessionalInterviewsTab;

      }, error => {
        this.professionalInterviews = [];
      });
  }

  /**
   * Trie la liste des bilans professionnels par date d'entretien
   * @param professionalInterviews liste de bilans professionnels
   * @return liste des bilans professionnels triés
   */
  sortProfessionalInterviewsByAnnualProfessionalInterviewDate(professionalInterviews: ProfessionalInterviewModel[]): ProfessionalInterviewModel[] {
    return professionalInterviews.sort((professionalInterview1, professionalInterview2) =>
      professionalInterview1.annualProfessionalInterviewDate < professionalInterview2.annualProfessionalInterviewDate ? 1 : -1);
  }

  /**
    * Récupère la liste des objectifs
    */
  initCareerObjectivesList() {
    this.careerObjectiveService.getPncCareerObjectives(this.matricule).then(result => {
      result.sort((careerObjective: CareerObjectiveModel, otherCareerObjective: CareerObjectiveModel) => {
        return careerObjective.creationDate < otherCareerObjective.creationDate ? 1 : -1;
      });
      this.careerObjectives = result;
    }, error => { });
  }


  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule, careerObjectiveId: 0 });
  }

  /**
   * Fait appel à formsLib avec les paramètres eObservation.
   */
  createEObservation() {
    this.formsInputParam = this.formsEObservationService.getFormsInputParams();
    if (this.formsInputParam) {
      this.formsEObservationService.callForms(this.formsInputParam, this.chosenEFormsType);
    }
    this.chosenEFormsType = null;
  }

  /**
   * Détermine si on peut créer une nouvelle eObservation
   * @return vrai si c'est le cas, faux sinon
   */
  canCreateEObservation(): boolean {
    if (this.sessionService.appContext.lastConsultedRotation && !this.deviceService.isBrowser()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.careerObjectives !== undefined && this.pnc !== undefined && this.eObservations !== undefined;
  }

  /**
   * Rafraichit les listes de la page
   */
  refreshPage() {
    this.initCareerObjectivesList();
    this.getEObservationsList();
    this.getProfessionalInterviewList();
  }

  /**
   * Redirige vers la page des archives des eObservations
   */
  goToEobservationsArchives() {
    this.navCtrl.push(EObservationsArchivesPage, { matricule: this.matricule });
  }


  /**
   * Redirige vers la page des archives des bilans professionnels
   */
  goToProfessionalInterviewsArchives() {
    this.navCtrl.push(ProfessionalInterviewsArchivesPage, { matricule: this.matricule });
  }

  /**
   * Affichage du menu de la liste des eForms
   */
  displayEObservationTypeSelection() {
    const typeOfEForms = this.getEObsTextTypeEForm();
    if (typeOfEForms.indexOf('/') == -1) {
      this.chosenEFormsType = EFormsTypeEnum.getType(EFormsTypeEnum[typeOfEForms.trim()]);
      this.createEObservation();
    } else {
      this.eFormsList = typeOfEForms.split('/');
      this.canDisplayMenu = true;
    }
  }

  /**
   * Appelle le formulaire choisi
   * @param value Valeur du type de formulaire choisie
   */
  getEFormsTypeBeforeCreate(value: string) {
    this.chosenEFormsType = EFormsTypeEnum.getType(EFormsTypeEnum[value.trim()]);
    this.canDisplayMenu = false;
    this.createEObservation();
  }

  /**
   * Vérifie si le mode admin est disponible
   * @return vrai si le mode admin est disponible, faux sinon
   */
  isAdminModeAvailable(): boolean {
    return this.securityService.isProfessionalInterviewAdmin();
  }

  /**
   * Renvoie la spécialité du pnc à afficher
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  getFormatedSpeciality(pnc: PncModel): string {
    return this.pncService.getFormatedSpeciality(pnc);
  }
}
