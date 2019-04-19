import { DateTransform } from './../../../../shared/utils/date-transform';
import { ProfessionalInterviewStatusService } from './../../../../core/services/professional-interview/professional-interview-status.service';
import { SecurityService } from './../../../../core/services/security/security.service';
import { OfflinePncService } from './../../../../core/services/pnc/offline-pnc.service';
import { DeviceService } from './../../../../core/services/device/device.service';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { OfflineProfessionalInterviewService } from './../../../../core/services/professional-interview/offline-professional-interview.service';
import { ProfessionalInterviewService } from './../../../../core/services/professional-interview/professional-interview.service';
import { PncTransformerService } from './../../../../core/services/pnc/pnc-transformer.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';

import { PncModel } from '../../../../core/models/pnc.model';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { ProfessionalInterviewModel } from './../../../../core/models/professional-interview/professional-interview.model';
import { ProfessionalInterviewStateEnum } from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { AppConstant } from '../../../../app.constant';
import * as _ from 'lodash';
import { Utils } from '../../../../shared/utils/utils';

@Component({
  selector: 'page-professional-interview-details',
  templateUrl: 'professional-interview-details.page.html',
})
export class ProfessionalInterviewDetailsPage {
  PncRoleEnum = PncRoleEnum;

  pnc: PncModel;
  professionalInterview: ProfessionalInterviewModel;
  originProfessionalInterview: ProfessionalInterviewModel;

  annualProfessionalInterviewOptions: any;
  monthsNames;
  datepickerMaxDate = AppConstant.datepickerMaxDate;
  annualProfessionalInterviewDateString: string;
  professionalInterviewDetailForm: FormGroup;

  loading: Loading;
  creationMode = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private pncService: PncService,
    private alertCtrl: AlertController,
    private sessionService: SessionService,
    private pncTransformer: PncTransformerService,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    private deviceService: DeviceService,
    private connectivityService: ConnectivityService,
    public securityService: SecurityService,
    public professionalInterviewService: ProfessionalInterviewService,
    public professionalInterviewStatusService: ProfessionalInterviewStatusService,
    public offlineProfessionalInterviewService: OfflineProfessionalInterviewService,
    private offlinePncService: OfflinePncService,
    private dateTransformer: DateTransform
  ) {
    this.professionalInterview = this.navParams.get('professionalInterview');
    if (this.professionalInterview && this.professionalInterview.matricule) {
      this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
      this.pncService.getPnc(this.professionalInterview.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });
    } else {
      this.creationMode = true;
      this.professionalInterview = this.sessionService.getActiveUser().parameters.params['blankProfessionnalInterview'];
      this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
      if (this.navParams.get('matricule')) {
        this.pncService.getPnc(this.navParams.get('matricule')).then(pnc => {
          this.pnc = pnc;
          this.professionalInterview.pncAtInterviewDate = this.pncTransformer.toPncLight(this.pnc);
          this.professionalInterview.pncAtInterviewDate.speciality = this.pncService.getFormatedSpeciality(this.pnc);
        }, error => { });
      }

    }
    this.professionalInterview.professionalInterviewThemes.sort((a, b) => {
      return a.themeOrder > b.themeOrder ? 1 : -1;
    });
    this.initForm();

    this.annualProfessionalInterviewOptions = {
      buttons: [{
        text: this.translateService.instant('GLOBAL.DATEPICKER.CLEAR'),
        handler: () => this.professionalInterview.annualProfessionalInterviewDate = null
      }]
    };

    // Traduction des mois
    this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.professionalInterviewDetailForm = this.formBuilder.group({
      annualProfessionalInterviewDateControl: ''
    });

  }

  /**
   * Vérifie si le formulaire a été modifié sans être enregistré
   */
  formHasBeenModified() {
    return Utils.getHashCode(this.originProfessionalInterview) !== Utils.getHashCode(this.professionalInterview);
  }

  /**
   * Définit la couleur en fonction du statut
   *
   * @return 'green' si 'TAKEN_INTO_ACCOUNT', 'red' si 'NOT_TAKEN_INTO_ACCOUNT' ou 'grey' si 'DRAFT'
   */
  getColorStatusPoint(): string {
    if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT) {
      return 'green';
    } else if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
      return 'grey';
    } else if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
      return 'red';
    }
  }


  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined;
  }

  /**
   * Lance le processus de création/mise à jour d'un bilan professionnel
   * @param professionalInterviewToSave le bilan professionnel à enregistrer
   */
  saveProfessionalInterview(professionalInterviewToSave: ProfessionalInterviewModel) {
    return new Promise((resolve, reject) => {
      professionalInterviewToSave = this.prepareProfessionalInterviewBeforeSubmit(professionalInterviewToSave);
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.professionalInterviewService.createOrUpdate(professionalInterviewToSave)
        .then(savedProfessionalInterview => {
          this.originProfessionalInterview = _.cloneDeep(savedProfessionalInterview);
          this.professionalInterview = savedProfessionalInterview;
          // en mode connecté, mettre en cache l'objectif creé ou modifié si le pnc est en cache
          if (this.deviceService.isOfflineModeAvailable() && this.connectivityService.isConnected()
            && this.offlinePncService.pncExists(this.professionalInterview.matricule)) {
            this.offlineProfessionalInterviewService.createOrUpdate(this.professionalInterview);
          }

          if (this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
            this.toastService.success(this.translateService.instant('PROFESSIONAL_INTERVIEW.SUCCESS.DRAFT_SAVED'));
          }
          this.loading.dismiss();
          resolve();
        }, error => {
          this.loading.dismiss();
        });

    });
  }

  /**
   * Enregistre le bilan professionnel au statut brouillon
   */
  saveProfessionalInterviewDraft() {
    const professionalInterviewToSave = _.cloneDeep(this.professionalInterview);
    professionalInterviewToSave.state = ProfessionalInterviewStateEnum.DRAFT;
    professionalInterviewToSave.matricule = this.pnc.matricule;
    this.saveProfessionalInterview(professionalInterviewToSave);
  }

  /**
   * Retourne true si c'est une proposition et qu'elle peut être modifiée par le user connecté
   * @return true si Draft && (CADRE ou auteur de la proposition)
   */
  isNewOrDraftAndCanBeModified(): boolean {
    const canBeSavedAsDraft: boolean = this.professionalInterviewStatusService.isTransitionOk(this.professionalInterview.state, ProfessionalInterviewStateEnum.DRAFT);
    const isInitiatorOrCadre: boolean = this.securityService.isManager() || (!this.professionalInterview.instructor || (this.professionalInterview.instructor.matricule === this.sessionService.authenticatedUser.matricule));
    return canBeSavedAsDraft && isInitiatorOrCadre && (!this.professionalInterview.state || this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT);
  }

  /**
   * Prépare le bilan professionnel avant de l'envoyer au back :
   * Transforme les dates au format iso
   * ou supprime l'entrée de l'objet si une ou plusieurs dates sont nulles
   *
   * @param professionalInterviewToSave
   * @return l'objectif à enregistrer avec la date de rencontre transformée
   */
  prepareProfessionalInterviewBeforeSubmit(professionalInterviewToSave: ProfessionalInterviewModel): ProfessionalInterviewModel {
    if (typeof this.annualProfessionalInterviewDateString !== undefined && this.annualProfessionalInterviewDateString !== null) {
      professionalInterviewToSave.annualProfessionalInterviewDate = new Date(this.annualProfessionalInterviewDateString);
      professionalInterviewToSave.annualProfessionalInterviewDate.setHours(12);
    }
    return professionalInterviewToSave;
  }

  /**
   * Enregistre un bilan professionnel au statut validé
   */
  savePorfessionalInterviewToValidatedStatus() {
    const professionalInterviewToSave = _.cloneDeep(this.professionalInterview);
    professionalInterviewToSave.state = ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT;
    this.saveProfessionalInterview(professionalInterviewToSave);
  }
}
