import { PncTransformerService } from './../../../../core/services/pnc/pnc-transformer.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, Loading, AlertController } from 'ionic-angular';

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
  creationMode: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private pncService: PncService,
    private alertCtrl: AlertController,
    private sessionService: SessionService,
    private pncTransformer: PncTransformerService
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
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined;
  }
}
