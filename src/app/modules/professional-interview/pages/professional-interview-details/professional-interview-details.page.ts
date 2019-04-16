import { ToastService } from './../../../../core/services/toast/toast.service';
import { ProfessionalInterviewService } from './../../../../core/services/professional-interview/professional-interview.service';
import { SecurityService } from './../../../../core/services/security/security.service';
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

@Component({
  selector: 'page-professional-interview-details',
  templateUrl: 'professional-interview-details.page.html',
})
export class ProfessionalInterviewDetailsPage {
  PncRoleEnum = PncRoleEnum;

  pnc: PncModel;
  professionalInterview: ProfessionalInterviewModel;

  annualProfessionalInterviewOptions: any;
  monthsNames;
  datepickerMaxDate = AppConstant.datepickerMaxDate;

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
    private securityService: SecurityService,
    private professionalInterviewService: ProfessionalInterviewService,
    private loadingCtrl: LoadingController,
    private toastService: ToastService
  ) {
    this.professionalInterview = this.navParams.get('professionalInterview');
    if (this.professionalInterview && this.professionalInterview.matricule) {
      this.pncService.getPnc(this.professionalInterview.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });
    } else {
      this.creationMode = true;
      this.professionalInterview = this.sessionService.getActiveUser().parameters.params['blankProfessionnalInterview'];
      this.professionalInterview.professionalInterviewThemes.sort((a, b) => {
        return a.themeOrder > b.themeOrder ? 1 : -1;
      });
      if (this.navParams.get('matricule')) {
        this.pncService.getPnc(this.navParams.get('matricule')).then(pnc => {
          this.pnc = pnc;
          this.professionalInterview.pncAtInterviewDate = this.pncTransformer.toPncLight(this.pnc);
          this.professionalInterview.pncAtInterviewDate.speciality = this.pncService.getFormatedSpeciality(this.pnc);
        }, error => { });
      }

    }
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
   * Définit la couleur en fonction du statut
   *
   * @return 'green' si 'TAKEN_INTO_ACCOUNT' ou 'red' si 'NOT_TAKEN_INTO_ACCOUNT'
   */
  getColorStatusPoint(): string {
    if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT) {
      return 'green';
    } else if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
      return 'red';
    }
  }

  /**
   * Présente une alerte pour confirmer la suppression du brouillon
   */
  confirmDeleteProfessionalInterviewDraft() {
    this.alertCtrl.create({
      title: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_DRAFT_DELETE.TITLE'),
      message: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_DRAFT_DELETE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_DRAFT_DELETE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_DRAFT_DELETE.CONFIRM'),
          handler: () => this.deleteProfessionalInterviewDraft()
        }
      ]
    }).present();
  }

  /**
   * Retourne true si c'est une proposition et si le pnc connecté est CADRE
   * @return true si Draft && CADRE
   */
  isDraftAndCanBeDeleted(): boolean {
    return this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT && this.securityService.isManager();
  }

  /**
  * Supprime un bilan professionnel au statut brouillon
  */
  deleteProfessionalInterviewDraft() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.professionalInterviewService
      .delete(this.professionalInterview.techId)
      .then(() => {
        this.toastService.success(this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.DRAFT_DELETED'));
        this.navCtrl.pop();
        this.loading.dismiss();
      }, error => {
        this.loading.dismiss();
      });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined;
  }
}
