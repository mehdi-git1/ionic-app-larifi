import { ProfessionalInterviewModel } from './../../../../core/models/professional-interview/professional-interview.model';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { EobservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EObservationFlightModel } from '../../../../core/models/eobservation/eobservation-flight.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { EObservationStateEnum } from '../../../../core/enums/e-observation-state.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import * as _ from 'lodash';
import { Utils } from '../../../../shared/utils/utils';

@Component({
  selector: 'page-eobservation-details',
  templateUrl: 'eobservation-details.page.html',
})
export class ProfessionalInterviewDetailsPage {
  PncRoleEnum = PncRoleEnum;

  professionalInterview: ProfessionalInterviewModel;
  originProfessionalInterview: ProfessionalInterviewModel;

  loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private eObservationService: EObservationService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    if (this.navParams.get('professionalInterview')) {
      this.professionalInterview = this.navParams.get('eObservation');
      this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
    }
  }

  ionViewCanLeave() {
    if (this.formHasBeenModified()) {
      return this.confirmAbandonChanges();
    } else {
      return true;
    }
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
    if (this.professionalInterview && this.professionalInterview.state === EObservationStateEnum.TAKEN_INTO_ACCOUNT) {
      return 'green';
    } else if (this.professionalInterview && this.professionalInterview.state === EObservationStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
      return 'red';
    }
  }

  /**
   * Récupère le label du type de l'eObs
   * @return le label à afficher
   */
  getTypeLabel(): string {
    if (!this.professionalInterview) {
      return '';
    }
    return EObservationTypeEnum.getLabel(this.professionalInterview.type);
  }

  /**
   * Récupère le label de l'option du type de l'eObs
   * @return le label à afficher
   */
  getDetailOptionType(): string {
    return this.eObservationService.getDetailOptionType(this.professionalInterview);
  }


  /**
   * Teste si le commentaire PNC peut être modifié
   * @return vrai si le commentaire peut être modifié, faux sinon
   */
  canEditPncComment(): boolean {
    return this.sessionService.getActiveUser().matricule === this.professionalInterview.pnc.matricule
      && (this.professionalInterview.pncComment === '' || typeof (this.originProfessionalInterview.pncComment) === 'undefined')
      && this.professionalInterview.type !== EObservationTypeEnum.E_ALT
      && this.professionalInterview.type !== EObservationTypeEnum.E_PCB;
  }

  /**
  * Demande la confirmation de la validation du commentaire du pnc
  */
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

  /**
 * Valide le commentaire pnc de l'eObservation
 */
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

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined;
  }
}
