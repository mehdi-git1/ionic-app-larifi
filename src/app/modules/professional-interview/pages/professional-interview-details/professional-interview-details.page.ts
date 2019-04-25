import { ProfessionalInterviewCommentItemTypeEnum } from './../../../../core/enums/professional-interview/professional-interview-comment-item-type.enum';
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
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { AppConstant } from '../../../../app.constant';
import { ProfessionalInterviewModel } from './../../../../core/models/professional-interview/professional-interview.model';
import { ProfessionalInterviewTypeEnum } from '../../../../core/enums/professional-interview/professional-interview-type.enum';
import { ProfessionalInterviewStateEnum } from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import { ProfessionalInterviewThemeModel } from '../../../../core/models/professional-interview/professional-interview-theme.model';

@Component({
  selector: 'page-professional-interview-details',
  templateUrl: 'professional-interview-details.page.html',
})
export class ProfessionalInterviewDetailsPage {
  PncRoleEnum = PncRoleEnum;

  pnc: PncModel;
  professionalInterview: ProfessionalInterviewModel;
  ProfessionalInterviewTypeEnum = ProfessionalInterviewTypeEnum;

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
      this.professionalInterview.professionalInterviewThemes.sort((theme1, theme2) => {
        return theme1.themeOrder  < theme2.themeOrder ? -1 : 1;
      });

      for (let i = 0; i < this.professionalInterview.professionalInterviewThemes.length; i++){
        this.professionalInterview.professionalInterviewThemes[i].subThemes.sort((ssTheme1, ssTheme2) => {
          return ssTheme1.themeOrder  < ssTheme2.themeOrder ? -1 : 1;
        });

        if (this.professionalInterview.professionalInterviewThemes[i].subThemes.length > 0){
          this.professionalInterview.professionalInterviewThemes[i].subThemes.forEach( function (value){
            value.professionalInterviewItems.sort((item1, item2) => {
              return item1.itemOrder < item2.itemOrder ? -1 : 1;
            });
          });
        }

      }
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
   * Teste si on traite un commentaire PNC
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire PNC
   */
  isPncComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean{
    if (professionalInterviewTheme.professionalInterviewItems[0]){
     return professionalInterviewTheme.professionalInterviewItems[0].key == ProfessionalInterviewCommentItemTypeEnum.PNCCOMMENT;
    }
    return false;
  }

  /**
   * Teste si on traite un commentaire instructeur
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire instructeur
   */
  isInstructorComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean{
    if (professionalInterviewTheme.professionalInterviewItems[0]){
      return professionalInterviewTheme.professionalInterviewItems[0].key == ProfessionalInterviewCommentItemTypeEnum.SYNTHESIS;
     }
     return false;
  }

  /**
   * Retourne le bon titre à afficher pour le théme
   * @param professionalInterviewTheme  ProfessionalInterviewTheme en cours de traitement
   * @return label à afficher
   */
 getThemeLabel(professionalInterviewTheme: ProfessionalInterviewThemeModel){
    if (!professionalInterviewTheme.subThemes || professionalInterviewTheme.subThemes.length === 0 ){
      return professionalInterviewTheme.professionalInterviewItems[0].label;
    } else {
      return professionalInterviewTheme.label;
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
          handler: () => this.deleteProfessionalInterview()
        }
      ]
    }).present();
  }

  /**
   * Retourne true si c'est une proposition et si le pnc connecté est CADRE
   * @return true si Draft && CADRE
   */
  canBeDeleted(): boolean {
    return this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT && this.securityService.isManager();
  }

  /**
  * Supprime un bilan professionnel
  */
  deleteProfessionalInterview() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.professionalInterviewService
      .delete(this.professionalInterview.techId)
      .then(() => {
        if (this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
          this.toastService.success(this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.DRAFT_DELETED'));
        }
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
