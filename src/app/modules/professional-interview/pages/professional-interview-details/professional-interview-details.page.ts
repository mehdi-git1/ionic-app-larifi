import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, AlertController, Loading } from 'ionic-angular';
import * as _ from 'lodash';

import { PncModel } from '../../../../core/models/pnc.model';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { ProfessionalInterviewModel } from './../../../../core/models/professional-interview/professional-interview.model';
import { Utils } from '../../../../shared/utils/utils';
import { ProfessionalInterviewStateEnum } from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { AppConstant } from '../../../../app.constant';

@Component({
  selector: 'professional-interview-details',
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

  professionalInterviewDetailForm: FormGroup;

  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private pncService: PncService,
    private alertCtrl: AlertController
  ) {
    if (this.navParams.get('professionalInterview')) {
      this.professionalInterview = this.navParams.get('professionalInterview');
      this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
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
        handler: () => this.professionalInterview.annualProfessionalInterview = null
      }]
    };

    // Traduction des mois
    this.monthsNames = this.translateService.instant('GLOBAL.MONTH.LONGNAME');

  }

  ionViewCanLeave() {
    if (this.formHasBeenModified()) {
      return this.confirmAbandonChanges();
    } else {
      return true;
    }
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.professionalInterviewDetailForm = this.formBuilder.group({
      annualProfessionalInterviewControl: '',
      noticedSkillsControl: '',
      professionalDevDesireControl: '',
      summaryControl: ''
    });

    this.professionalInterviewDetailForm.valueChanges.subscribe(
      result => console.log(this.professionalInterviewDetailForm.status)
    );
  }

  /**
  * Vérifie si le formulaire a été modifié sans être enregistré
  */
  formHasBeenModified() {
    return Utils.getHashCode(this.originProfessionalInterview) !== Utils.getHashCode(this.professionalInterview);
  }

  /**
  * Popup d'avertissement en cas de modifications non enregistrées.
  */
  confirmAbandonChanges() {
    return new Promise((resolve, reject) => {
      // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
      this.alertCtrl.create({
        title: this.translateService.instant('EOBSERVATION.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
        message: this.translateService.instant('EOBSERVATION.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE'),
        buttons: [
          {
            text: this.translateService.instant('GLOBAL.BUTTONS.CANCEL'),
            role: 'cancel',
            handler: () => reject()
          },
          {
            text: this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
            handler: () => resolve()
          }
        ]
      }).present();
    });
  }

  /** Crée un objet CrewMember à partir d'un objet PncModel
   * @param pnc pnc à transformer
   */
  createCrewMemberObjectFromPnc(pnc: PncModel) {
    const crewMember: CrewMemberModel = new CrewMemberModel();
    crewMember.pnc = pnc;
    return crewMember;
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
   * Teste si le commentaire PNC peut être modifié
   * @return vrai si le commentaire peut être modifié, faux sinon
   */
  /*
  canEditPncComment(): boolean {
    return this.sessionService.getActiveUser().matricule === this.professionalInterview.pnc.matricule
      && (this.professionalInterview.pncComment === '' || typeof (this.originProfessionalInterview.pncComment) === 'undefined')
      && this.professionalInterview.type !== EObservationTypeEnum.E_ALT
      && this.professionalInterview.type !== EObservationTypeEnum.E_PCB;
  }
  */

  /**
  * Demande la confirmation de la validation du commentaire du pnc
  */
  /*
   confirmValidatePncComment(): void {
     this.alertCtrl.create({
       title: this.translateService.instant('EOBSERVATION.CONFIRM_VALIDATE_PNC_COMMENT.TITLE'),
       message: this.translateService.instant('EOBSERVATION.CONFIRM_VALIDATE_PNC_COMMENT.MESSAGE'),
       buttons: [
         {
           text: this.translateService.instant('EOBSERVATION.CONFIRM_VALIDATE_PNC_COMMENT.CANCEL'),
           role: 'cancel'
         },
         {
           text: this.translateService.instant('EOBSERVATION.CONFIRM_VALIDATE_PNC_COMMENT.CONFIRM'),
           handler: () => this.validatePncComment()
         }
       ]
     }).present();
   }
   */

  /**
 * Valide le commentaire pnc de l'eObservation
 */
  /*
    validatePncComment(): void {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      // On transmet un objet cloné pour éviter toute modif de l'objet par le service
      const eObservationClone = _.cloneDeep(this.professionalInterview);
      this.eObservationService.validatePncComment(eObservationClone).then(eObservation => {
        this.professionalInterview = eObservation;
        this.originEObservation = _.cloneDeep(this.professionalInterview);
        this.toastService.success(this.translateService.instant('EOBSERVATION.MESSAGES.SUCCESS.PNC_COMMENT_SAVED'));
        this.navCtrl.pop();
      }, error => { }).then(() => {
        // Finally
        this.loading.dismiss();
      });
    }
    */

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined;
  }
}
