import { ProfessionalInterviewCommentItemTypeEnum } from './../../../../core/enums/professional-interview/professional-interview-comment-item-type.enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, Loading } from 'ionic-angular';

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
  professionalInterviewType;

  annualProfessionalInterviewOptions: any;
  monthsNames;
  datepickerMaxDate = AppConstant.datepickerMaxDate;

  professionalInterviewDetailForm: FormGroup;

  // Retient le dernier label de parant affiché
  lastParentThemeLabel: string;

  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private pncService: PncService
  ) {
    this.professionalInterviewType = ProfessionalInterviewTypeEnum;

    if (this.navParams.get('professionalInterview')) {
      this.professionalInterview = this.navParams.get('professionalInterview');

      this.professionalInterview.professionalInterviewThemes.sort((theme1, theme2) => {
        return theme1.themeOrder  < theme2.themeOrder ? -1 : 1;
      });

      for (let i = 0; i < this.professionalInterview.professionalInterviewThemes.length; i++){
        this.professionalInterview.professionalInterviewThemes[i].subTheme.sort((ssTheme1, ssTheme2) => {
          return ssTheme1.themeOrder  < ssTheme2.themeOrder ? -1 : 1;
        });
      }

      if (this.professionalInterview && this.professionalInterview.matricule) {
        this.pncService.getPnc(this.professionalInterview.matricule).then(pnc => {
          this.pnc = pnc;
        }, error => { });
      }
      this.initForm();
    }

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
   * Savoir si on traite un bloc de commentaire PNC
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire PNC
   */
  isPncComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean{
     return professionalInterviewTheme.subTheme[0].professionalInterviewItems[0].key == ProfessionalInterviewCommentItemTypeEnum.PNCCOMMENT;
  }

    /**
   * Savoir si on traite un bloc de commentaire instructeur
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire instructeur
   */
  isInstructorComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean{
    return professionalInterviewTheme.subTheme[0].professionalInterviewItems[0].key == ProfessionalInterviewCommentItemTypeEnum.SYNTHESIS;
  }

  /**
   * Affichage du sous-théme ou pas (seulement pour EPP)
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return label à afficher
  */
  displaySubTheme(parentLabel: string): string{
    return this.professionalInterview.type === ProfessionalInterviewTypeEnum.EPP && parentLabel;
  }

  /**
   * Retourne le bon titre à afficher pour le théme
   * @param professionalInterviewTheme  ProfessionalInterviewTheme en cours de traitement
   * @return label à afficher
  */
 getThemeLabel(professionalInterviewTheme: ProfessionalInterviewThemeModel){
    if (professionalInterviewTheme.label === '' || !professionalInterviewTheme.label){
      return professionalInterviewTheme.subTheme[0].label;
    } else {
      return professionalInterviewTheme.label;
    }
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined;
  }
}
