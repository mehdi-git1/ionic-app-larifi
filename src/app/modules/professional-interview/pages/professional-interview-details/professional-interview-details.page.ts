import * as _ from 'lodash';

import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import {
    ProfessionalInterviewCommentItemTypeEnum
} from '../../../../core/enums/professional-interview/professional-interview-comment-item-type.enum';
import {
    ProfessionalInterviewStateEnum
} from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import {
    ProfessionalInterviewTypeEnum
} from '../../../../core/enums/professional-interview/professional-interview-type.enum';
import { DocumentModel } from '../../../../core/models/document.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    ProfessionalInterviewThemeModel
} from '../../../../core/models/professional-interview/professional-interview-theme.model';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { OfflinePncService } from '../../../../core/services/pnc/offline-pnc.service';
import { PncTransformerService } from '../../../../core/services/pnc/pnc-transformer.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    OfflineProfessionalInterviewService
} from '../../../../core/services/professional-interview/offline-professional-interview.service';
import {
    ProfessionalInterviewStatusService
} from '../../../../core/services/professional-interview/professional-interview-status.service';
import {
    ProfessionalInterviewService
} from '../../../../core/services/professional-interview/professional-interview.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { DateTransform } from '../../../../shared/utils/date-transform';
import { Utils } from '../../../../shared/utils/utils';

@Component({
  selector: 'page-professional-interview-details',
  templateUrl: 'professional-interview-details.page.html',
  styleUrls: ['./professional-interview-details.page.scss']
})
export class ProfessionalInterviewDetailsPage {

  PncRoleEnum = PncRoleEnum;

  pnc: PncModel;
  professionalInterview: ProfessionalInterviewModel;
  originProfessionalInterview: ProfessionalInterviewModel;
  ProfessionalInterviewTypeEnum = ProfessionalInterviewTypeEnum;
  ProfessionalInterviewStateEnum = ProfessionalInterviewStateEnum;

  editionMode = false;

  isPncCommentEditable = false;

  professionalInterviewForm: FormGroup;
  interviewThemes: FormArray;
  subThemes: FormArray;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private pncService: PncService,
    private sessionService: SessionService,
    private pncTransformer: PncTransformerService,
    private loadingCtrl: LoadingController,
    private securityService: SecurityService,
    private professionalInterviewService: ProfessionalInterviewService,
    private professionalInterviewStatusService: ProfessionalInterviewStatusService,
    private offlineProfessionalInterviewService: OfflineProfessionalInterviewService,
    private offlinePncService: OfflinePncService,
    private dateTransformer: DateTransform,
    private toastService: ToastService,
    private deviceService: DeviceService,
    private connectivityService: ConnectivityService,
    private alertCtrl: AlertController,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) {
    this.initPage();
    this.initForm();
  }

  /**
   * Vérifie si l'on peut quitter la page
   * @return true si le formulaire n'a pas été modifié
   */
  canDeactivate(): boolean {
    return !this.formHasBeenModified();
  }

  /**
   * Initialise le contenu de la page
   */
  initPage() {
    if (this.activatedRoute.snapshot.paramMap.get('professionalInterviewId')) {
      this.loadProfessionalInterview();
    } else {
      this.createNewProfessionalInterview();
      this.isPncCommentEditable = true;
    }
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    const group = {};
    if (this.professionalInterview) {
      this.professionalInterview.professionalInterviewThemes.forEach(theme => {
        theme.professionalInterviewItems.forEach(themeItem => {
          group[themeItem.label] = new FormControl(themeItem.value);
        });
        theme.subThemes.forEach(subTheme => {
          subTheme.professionalInterviewItems.forEach(subThemeItem => {
            group[subThemeItem.label] = new FormControl(subThemeItem.value);
          });
        });
      });
    }
    group['professionalInterviewDateControl'] = new FormControl('');
    group['pncCommentControl'] = new FormControl('');
    group['pncAcknowledgementControl'] = new FormControl('');
    this.professionalInterviewForm = this.formBuilder.group(group);
  }

  /**
   * Charge le bilan professionnel
   */
  loadProfessionalInterview() {
    this.professionalInterviewService.getProfessionalInterview(
      parseInt(this.activatedRoute.snapshot.paramMap.get('professionalInterviewId'), 10))
      .then(professionalInterview => {
        this.professionalInterview = professionalInterview;
        if (!this.originProfessionalInterview) {
          this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
        }
        if (this.professionalInterview.matricule === this.sessionService.getActiveUser().matricule
          && this.professionalInterview.state === ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
          this.saveProfessionalInterviewToConsultState();
        }
        this.sortProfessionalInterviewItems();

        this.pncService.getPnc(this.professionalInterview.matricule).then(pnc => {
          this.pnc = pnc;
        }, error => { });
        this.editionMode = this.isEditable();
        this.isPncCommentEditable = (this.isConcernedPnc()
          && !this.pncCommentIsNotEmpty())
          || (this.isAdminModeAvailable() && this.editionMode);
        this.initForm();
      });
  }

  /**
   * Tri les thèmes et items du bilan professionnel
   */
  private sortProfessionalInterviewItems() {
    this.professionalInterview.professionalInterviewThemes.sort((theme1, theme2) => {
      return theme1.themeOrder < theme2.themeOrder ? -1 : 1;
    });

    for (const theme of this.professionalInterview.professionalInterviewThemes) {
      if (theme.subThemes.length > 0) {
        theme.subThemes.sort((subTheme1, subTheme2) => {
          return subTheme1.themeOrder < subTheme2.themeOrder ? -1 : 1;
        });
        theme.subThemes.forEach((value) => {
          value.professionalInterviewItems.sort((item1, item2) => {
            return item1.itemOrder < item2.itemOrder ? -1 : 1;
          });
        });
      }

    }
  }

  /**
   * 
   * @param key 
   */
  isWishSection(key: string): boolean {
    return (key === 'wish');
  }
  /**
   * Prépare un formulaire de création pour un nouveau bilan professionnel
   */
  createNewProfessionalInterview() {
    this.professionalInterview = _.cloneDeep(this.sessionService.getActiveUser().appInitData.blankProfessionalInterview);
    this.professionalInterview.type = ProfessionalInterviewTypeEnum.BILAN;
    this.professionalInterview.attachmentFiles = new Array<DocumentModel>();
    this.professionalInterview.professionalInterviewThemes.sort((a, b) => {
      return a.themeOrder > b.themeOrder ? 1 : -1;
    });

    const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(matricule).then(pnc => {
      this.pnc = pnc;
      this.professionalInterview.pncAtInterviewDate = this.pncTransformer.toPncLight(this.pnc);
      this.professionalInterview.pncAtInterviewDate.speciality = this.pnc.currentSpeciality;
      this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
    }, error => { });

    this.editionMode = true;
  }

  /**
   * Vérifie si le formulaire a été modifié sans être enregistré
   * @return true si il n'y a pas eu de modifications
   */
  formHasBeenModified() {
    return this.professionalInterview.annualProfessionalInterviewDate !== this.originProfessionalInterview.annualProfessionalInterviewDate
      || Utils.getHashCode(this.originProfessionalInterview) !== Utils.getHashCode(this.professionalInterview);
  }

  /**
   * Vérifie que le bilan professionnel est éditable
   * @return true si le bilan professionnel est nouveau ou si il est en brouillon et que l'utilisateur connecté est un cadre
   */
  isEditable() {
    // Mode création
    if (!this.professionalInterview || !this.professionalInterview.state) {
      return true;
    }

    // Admin métier : on démarre en mode non éditable mais l'admin pourra l'enclencher manuellement s'il le souhaite
    if (this.isAdminModeAvailable()) {
      return false;
    }

    // Manager
    if (this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT && this.securityService.isManager()) {
      return true;
    }

    return false;
  }

  /**
   * Vérifie si le commentaire pnc est vide
   */
  pncCommentIsNotEmpty() {
    if (!this.professionalInterview.pncComment
      || typeof (this.professionalInterview.pncComment) === 'undefined'
      || this.professionalInterview.pncComment.trim() === '') {
      return false;
    }
    return true;
  }

  /**
   * Définit la couleur en fonction du statut
   *
   * @return 'green' si 'TAKEN_INTO_ACCOUNT', 'red' si 'NOT_TAKEN_INTO_ACCOUNT', 'grey' si 'DRAFT' ou 'orange' si CONSULTED
   */
  getColorStatusPoint(): string {
    if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT) {
      return 'green';
    } else if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
      return 'grey';
    } else if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
      return 'red';
    } else if (this.professionalInterview && this.professionalInterview.state === ProfessionalInterviewStateEnum.CONSULTED) {
      return 'orange';
    }
  }

  /**
   * Teste si on traite un commentaire PNC
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire PNC
   */
  isPncComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean {
    if (professionalInterviewTheme.professionalInterviewItems[0]) {
      return professionalInterviewTheme.professionalInterviewItems[0].key === ProfessionalInterviewCommentItemTypeEnum.PNCCOMMENT;
    }
    return false;
  }

  /**
   * Teste si on traite un commentaire instructeur
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire instructeur
   */
  isInstructorComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean {
    if (professionalInterviewTheme.professionalInterviewItems[0]) {
      return professionalInterviewTheme.professionalInterviewItems[0].key === ProfessionalInterviewCommentItemTypeEnum.SYNTHESIS;
    }
    return false;
  }

  /**
   * Retourne le bon titre à afficher pour le théme
   * @param professionalInterviewTheme  ProfessionalInterviewTheme en cours de traitement
   * @return label à afficher
   */
  getThemeLabel(professionalInterviewTheme: ProfessionalInterviewThemeModel) {
    if (!professionalInterviewTheme.subThemes || professionalInterviewTheme.subThemes.length === 0) {
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
      header: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_DRAFT_DELETE.TITLE'),
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
    }).then(alert => alert.present());
  }

  /**
   * Demande la confirmation de la validation du bilan professionnel avec le commentaire du pnc
   */
  confirmSaveWithPncComment() {
    this.alertCtrl.create({
      header: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_COMMENT.TITLE'),
      message: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_COMMENT.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_COMMENT.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.CONFIRM_COMMENT.CONFIRM'),
          handler: () => this.saveProfessionalInterviewToTakenIntoAccountState()
        }
      ]
    }).then(alert => alert.present());
  }

  /**
   * Prend en compte un bilan professionnel
   */
  takeIntoAccountProfessionalInterview() {
    const isAdminButNotEditionAdminMode = this.isAdminModeAvailable() && !this.editionMode;
    if ((!this.isAdminModeAvailable() || isAdminButNotEditionAdminMode)
      && this.isPncCommentEditable && this.professionalInterview.pncComment) {
      this.confirmSaveWithPncComment();
    } else {
      this.saveProfessionalInterviewToTakenIntoAccountState();
    }
  }

  /**
   * Retourne true si c'est un brouillon et si le pnc connecté est CADRE
   * @return true si Draft && CADRE
   */
  canBeDeleted(): boolean {
    return this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT && this.securityService.isManager();
  }

  /**
   * Supprime un bilan professionnel
   */
  deleteProfessionalInterview() {
    this.loadingCtrl.create().then(loading => {
      loading.present();

      this.professionalInterviewService
        .delete(this.professionalInterview.techId)
        .then(() => {
          if (this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
            this.toastService.success(this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.DRAFT_DELETED'));
          }
          this.navCtrl.pop();
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
    });


  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalInterview !== undefined && this.pnc !== undefined;
  }

  /**
   * Lance le processus de création/mise à jour d'un bilan professionnel
   * @param professionalInterviewToSave le bilan professionnel à enregistrer
   */
  saveProfessionalInterview(professionalInterviewToSave: ProfessionalInterviewModel) {
    return new Promise((resolve, reject) => {
      professionalInterviewToSave = this.prepareProfessionalInterviewBeforeSubmit(professionalInterviewToSave);
      this.loadingCtrl.create().then(loading => {
        loading.present();

        this.professionalInterviewService.createOrUpdate(professionalInterviewToSave)
          .then(savedProfessionalInterview => {
            const professionalInterviewPreviousState = this.originProfessionalInterview.state;
            this.originProfessionalInterview = _.cloneDeep(savedProfessionalInterview);
            this.professionalInterview = savedProfessionalInterview;

            this.sortProfessionalInterviewItems();

            // en mode connecté, mettre en cache le bilan professionnel créé ou modifié si le pnc est en cache
            if (this.deviceService.isOfflineModeAvailable() && this.connectivityService.isConnected()
              && this.offlinePncService.pncExists(this.professionalInterview.matricule)) {
              this.offlineProfessionalInterviewService.createOrUpdate(this.professionalInterview, true);
            }

            this.manageToastAfterSave(professionalInterviewPreviousState);

            loading.dismiss();
            resolve();
          }, error => {
            loading.dismiss();
          });

      });
    });

  }

  /**
   * Gère les toasts à afficher en fonction du statut du Bilan Professionnel
   * @param professionalInterviewPreviousState statut précédent du Bilan Professionnel
   */
  private manageToastAfterSave(professionalInterviewPreviousState: ProfessionalInterviewStateEnum) {
    if (this.professionalInterview.state === professionalInterviewPreviousState) {
      this.toastService.success(this.professionalInterview.type === this.ProfessionalInterviewTypeEnum.BILAN ?
        this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.PI_UPDATED')
        : this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.EPP_UPDATED'));
      if (this.isAdminModeAvailable()) {
        this.editionMode = false;
      } else {
        this.navCtrl.pop();
      }
    } else {
      if (this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
        this.toastService.success(this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.DRAFT_SAVED'));
        this.navCtrl.pop();
      }
      if (this.professionalInterview.state === ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT) {
        this.toastService.success(this.professionalInterview.type === this.ProfessionalInterviewTypeEnum.BILAN ?
          this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.PI_TAKEN_INTO_ACCOUNT')
          : this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.EPP_TAKEN_INTO_ACCOUNT'));
        this.navCtrl.pop();
      }
      if (this.professionalInterview.state === ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT) {
        this.toastService.success(this.professionalInterview.type === this.ProfessionalInterviewTypeEnum.BILAN ?
          this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.PI_VALIDATED')
          : this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.EPP_VALIDATED'));
        this.navCtrl.pop();
      }
    }
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
   * Enregistre le bilan professionnel au statut consultation
   */
  saveProfessionalInterviewToConsultState() {
    const professionalInterviewToSave = _.cloneDeep(this.professionalInterview);
    professionalInterviewToSave.state = ProfessionalInterviewStateEnum.CONSULTED;
    this.saveProfessionalInterview(professionalInterviewToSave);
    this.professionalInterview.state = ProfessionalInterviewStateEnum.CONSULTED;
  }

  /**
   * Enregistre le bilan professionnel au statut pris en compte
   */
  saveProfessionalInterviewToTakenIntoAccountState() {
    const professionalInterviewToSave = _.cloneDeep(this.professionalInterview);
    professionalInterviewToSave.state = ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT;
    professionalInterviewToSave.matricule = this.pnc.matricule;
    professionalInterviewToSave.pncSignatureDate = new Date();
    this.saveProfessionalInterview(professionalInterviewToSave);
  }

  /**
   * Verifie que tout les champs de saisie sont remplis
   */
  isAllIFieldsAreFilled() {
    if (!this.professionalInterview.annualProfessionalInterviewDate) {
      return false;
    }
    let returnValue = true;
    this.professionalInterview.professionalInterviewThemes.forEach(professionalInterviewTheme => {
      professionalInterviewTheme.professionalInterviewItems.forEach(item => {
        if (!item.value || typeof item.value === undefined || item.value === '') {
          returnValue = false;
        }
      });
    });
    return returnValue;
  }

  /**
   * Teste que le user connecté est cadre et que le bilan professionnel peut être enregsitré avec le statut en paramètre
   * @return true si Draft && (CADRE ou auteur du brouillon)
   */
  canBeSavedInState(state: ProfessionalInterviewStateEnum): boolean {
    const canBeSaved: boolean = this.professionalInterviewStatusService.isTransitionOk(this.professionalInterview.state, state);
    return canBeSaved && this.securityService.isManager();
  }

  /**
   * Vérifie si le Pnc connecté est le Pnc concerné
   */
  isConcernedPnc(): boolean {
    return this.professionalInterview.matricule === this.sessionService.getActiveUser().matricule;
  }

  /**
   * Teste si le bilan professionnel peut étre enregistré par le pnc.
   * @return true si non pris en compte && l'utilisateur connecté est le pnc concerné
   */
  canBeTakenIntoAccount(): boolean {
    const canBeSavedAsTakenIntoAccount: boolean = this.professionalInterviewStatusService.isTransitionOk(this.professionalInterview.state, ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT);
    return this.isConcernedPnc() && (canBeSavedAsTakenIntoAccount || this.isPncCommentEditable);
  }

  /**
   * Teste si le commentaire PNC peut être ajouté
   * @return vrai si le commentaire peut être ajouté, faux sinon
   */
  canAddPncComment(): boolean {
    return this.sessionService.getActiveUser().matricule === this.professionalInterview.matricule
      && (this.professionalInterview.pncComment === '' || typeof (this.professionalInterview.pncComment) === 'undefined');
  }

  /**
   * Vérifie si le statut du bilan professionnel est celui passé en paramètre
   * @param professionalInterviewState statut du bilan professionnel à vérifier
   * @return true si le statut du bilan professionnel est celui passé en paramètre, false sinon
   */
  checkProfessionaInterviewState(professionalInterviewState: ProfessionalInterviewStateEnum): boolean {
    return this.professionalInterview && professionalInterviewState === this.professionalInterview.state;
  }

  /**
   * Prépare le bilan professionnel avant de l'envoyer au back :
   * Transforme les dates au format iso
   * ou supprime l'entrée de l'objet si une ou plusieurs dates sont nulles
   *
   * @param professionalInterviewToSave le bilan professionnel à sauvegarder
   * @return l'objectif à enregistrer avec la date de rencontre transformée
   */
  prepareProfessionalInterviewBeforeSubmit(professionalInterviewToSave: ProfessionalInterviewModel): ProfessionalInterviewModel {
    if (typeof this.professionalInterview.annualProfessionalInterviewDate !== 'undefined'
      && this.professionalInterview.annualProfessionalInterviewDate !== null) {
      professionalInterviewToSave.annualProfessionalInterviewDate =
        this.dateTransformer.transformDateStringToIso8601Format(this.professionalInterview.annualProfessionalInterviewDate);
    }
    return professionalInterviewToSave;
  }

  /**
   * Enregistre un bilan professionnel au statut validé
   */
  saveProfessionalInterviewToValidatedStatus() {
    const professionalInterviewToSave = _.cloneDeep(this.professionalInterview);
    professionalInterviewToSave.state = ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT;
    professionalInterviewToSave.matricule = this.pnc.matricule;
    professionalInterviewToSave.instructorValidationDate = new Date();
    this.saveProfessionalInterview(professionalInterviewToSave);
  }

  /**
   * Active le mode édition
   */
  enterEditMode() {
    this.initForm();
    this.editionMode = true;
  }

  /**
   * Annule le mode édition
   */
  cancelEditMode() {
    this.editionMode = false;
    this.professionalInterview = _.cloneDeep(this.originProfessionalInterview);
  }

  /**
   * Vérifie si le mode admin est disponible
   * @return vrai si le mode admin est disponible, faux sinon
   */
  isAdminModeAvailable(): boolean {
    return (this.professionalInterview.state === ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT
      || this.professionalInterview.state === ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT
      || this.professionalInterview.state === ProfessionalInterviewStateEnum.CONSULTED)
      && (this.sessionService.getActiveUser().matricule === this.professionalInterview.redactor.matricule
        || this.securityService.isProfessionalInterviewAdmin());
  }

  /**
   * Retourne la date de dernière modification, formatée pour l'affichage
   * @return la date de dernière modification au format dd/mm/yyyy hh:mm
   */
  getLastUpdateDate(): string {
    return this.datePipe.transform(this.professionalInterview.lastUpdateDate, 'dd/MM/yyyy HH:mm');
  }

}
