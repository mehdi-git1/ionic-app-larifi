import { EObsBilanFlightComponent } from './../../../eobservation/components/eobs-bilan-flight/eobs-bilan-flight.component';
import { DateTransform } from './../../../../shared/utils/date-transform';
import { ProfessionalInterviewStatusService } from './../../../../core/services/professional-interview/professional-interview-status.service';
import { SecurityService } from './../../../../core/services/security/security.service';
import { OfflinePncService } from './../../../../core/services/pnc/offline-pnc.service';
import { DeviceService } from './../../../../core/services/device/device.service';
import { ProfessionalInterviewCommentItemTypeEnum } from './../../../../core/enums/professional-interview/professional-interview-comment-item-type.enum';
import { ToastService } from './../../../../core/services/toast/toast.service';
import { ConnectivityService } from './../../../../core/services/connectivity/connectivity.service';
import { OfflineProfessionalInterviewService } from './../../../../core/services/professional-interview/offline-professional-interview.service';
import { ProfessionalInterviewService } from './../../../../core/services/professional-interview/professional-interview.service';
import { PncTransformerService } from './../../../../core/services/pnc/pnc-transformer.service';
import { SessionService } from './../../../../core/services/session/session.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';

import { PncModel } from '../../../../core/models/pnc.model';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { AppConstant } from '../../../../app.constant';
import * as _ from 'lodash';
import { Utils } from '../../../../shared/utils/utils';
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
  originProfessionalInterview: ProfessionalInterviewModel;
  ProfessionalInterviewTypeEnum = ProfessionalInterviewTypeEnum;

  annualProfessionalInterviewOptions: any;
  monthsNames;
  datepickerMaxDate = AppConstant.datepickerMaxDate;
  annualProfessionalInterviewDateString: string;
  professionalInterviewDetailForm: FormGroup;

  loading: Loading;
  editionMode = false;

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

  ionViewWillEnter() {
    this.initPage();
  }

  /**
   * Initialise le contenu de la page
   */
  initPage() {
    this.professionalInterview = this.navParams.get('professionalInterview');
    if (this.professionalInterview && this.professionalInterview.matricule) {
      this.professionalInterview.professionalInterviewThemes.sort((theme1, theme2) => {
        return theme1.themeOrder < theme2.themeOrder ? -1 : 1;
      });

      for (let i = 0; i < this.professionalInterview.professionalInterviewThemes.length; i++) {
        this.professionalInterview.professionalInterviewThemes[i].subThemes.sort((ssTheme1, ssTheme2) => {
          return ssTheme1.themeOrder < ssTheme2.themeOrder ? -1 : 1;
        });
      }
      this.pncService.getPnc(this.professionalInterview.matricule).then(pnc => {
        this.pnc = pnc;
      }, error => { });
    } else {
      this.professionalInterview = _.cloneDeep(this.sessionService.getActiveUser().parameters.params['blankProfessionnalInterview']);
      this.professionalInterview.type = ProfessionalInterviewTypeEnum.BILAN;
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
    this.originProfessionalInterview = _.cloneDeep(this.professionalInterview);
    this.annualProfessionalInterviewDateString = this.professionalInterview.annualProfessionalInterviewDate;
    this.editionMode = this.isEditable();
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.professionalInterviewDetailForm = this.formBuilder.group({
      annualProfessionalInterviewDateControl: ['', Validators.required]
    });

  }

  /**
   * Vérifie si le formulaire a été modifié sans être enregistré
   * @return true si il n'y a pas eu de modifications
   */
  formHasBeenModified() {
    return Utils.getHashCode(this.originProfessionalInterview) !== Utils.getHashCode(this.professionalInterview);
  }
  /**
   * Vérifie que le bilan professionnel est éditable
   * @return true si le bilan professionnel est nouveau ou si il est en brouillon et que l'utilisateur connecté est un cadre
   */
  isEditable() {
    if (!this.professionalInterview || !this.professionalInterview.state
      || (this.professionalInterview.state == ProfessionalInterviewStateEnum.DRAFT && this.securityService.isManager())) {
      return true;
    }
    return false;
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

  ionViewCanLeave() {
    if (this.formHasBeenModified()) {
      return this.confirmAbandonChanges().then(() => {
        this.professionalInterviewDetailForm.reset();
        this.professionalInterview = _.cloneDeep(this.originProfessionalInterview);
      }
      );
    } else {
      return true;
    }
  }

  /**
   * Popup d'avertissement en cas de modifications non enregistrées.
   */
  confirmAbandonChanges() {
    return new Promise((resolve, reject) => {
      // Avant de quitter la vue, on avertit l'utilisateur si ses modifications n'ont pas été enregistrées
      this.alertCtrl.create({
        title: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
        message: this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE'),
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

  /**
   * Teste si on traite un commentaire PNC
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire PNC
   */
  isPncComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean {
    if (professionalInterviewTheme.professionalInterviewItems[0]) {
      return professionalInterviewTheme.professionalInterviewItems[0].key == ProfessionalInterviewCommentItemTypeEnum.PNCCOMMENT;
    }
    return false;
  }

  /**
   * Teste si on traite un commentaire instructeur
   * @param professionalInterviewTheme ProfessionalInterviewTheme en cours de traitement
   * @return true si c'est un commentaire instructeur
   */
  isInstructorComment(professionalInterviewTheme: ProfessionalInterviewThemeModel): boolean {
    console.log(this.professionalInterview);
    if (professionalInterviewTheme.professionalInterviewItems[0]) {
      return professionalInterviewTheme.professionalInterviewItems[0].key == ProfessionalInterviewCommentItemTypeEnum.SYNTHESIS;
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
            this.offlineProfessionalInterviewService.createOrUpdate(this.professionalInterview, true);
          }

          if (this.professionalInterview.state === ProfessionalInterviewStateEnum.DRAFT) {
            this.toastService.success(this.translateService.instant('PROFESSIONAL_INTERVIEW.DETAILS.SUCCESS.DRAFT_SAVED'));
            this.navCtrl.pop();
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
  canBeSavedAsDraft(): boolean {
    const canBeSavedAsDraft: boolean = this.professionalInterviewStatusService.isTransitionOk(this.professionalInterview.state, ProfessionalInterviewStateEnum.DRAFT);
    const isInitiatorOrCadre: boolean = this.securityService.isManager() || (!this.professionalInterview.instructor || (this.professionalInterview.instructor.matricule === this.sessionService.authenticatedUser.matricule));
    return canBeSavedAsDraft && isInitiatorOrCadre;
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
      professionalInterviewToSave.annualProfessionalInterviewDate = this.dateTransformer.transformDateStringToIso8601Format(this.annualProfessionalInterviewDateString);
    }
    professionalInterviewToSave.type = ProfessionalInterviewTypeEnum.BILAN;
    return professionalInterviewToSave;
  }
}
