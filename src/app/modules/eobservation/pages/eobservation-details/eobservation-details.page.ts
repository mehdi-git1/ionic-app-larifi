import * as _ from 'lodash';

import { DatePipe, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { PermissionConstant } from '../../../../core/constants/permission.constant';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import {
    ReferentialItemLevelModel
} from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CancelChangesService
} from '../../../../core/services/cancel_changes/cancel-changes.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FormCanDeactivate } from '../../../../routing/guards/form-changes.guard';
import { Utils } from '../../../../shared/utils/utils';

@Component({
  selector: 'page-eobservation-details',
  templateUrl: 'eobservation-details.page.html',
  styleUrls: ['./eobservation-details.page.scss']
})
export class EobservationDetailsPage extends FormCanDeactivate {

  @ViewChild('form', { static: false }) form: NgForm;

  readonly EOBS_FULL_EDITION = PermissionConstant.EOBS_FULL_EDITION;
  PncRoleEnum = PncRoleEnum;
  EObservationTypeEnum = EObservationTypeEnum;

  eObservation: EObservationModel;
  pnc: PncModel;
  originEObservation: EObservationModel;

  editMode = false;
  pdfFileName: string;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private eObservationService: EObservationService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private pncService: PncService,
    private connectivityService: ConnectivityService,
    private datePipe: DatePipe,
    private cancelChangesService: CancelChangesService) {
      super();
      this.initPage();
  }

  /**
   * Effectue les opérations nécessaires à l'initialisation de la page
   */
  initPage() {
    if (this.activatedRoute.snapshot.paramMap.get('eObservationId')) {
      this.eObservationService.getEObservation(parseInt(this.activatedRoute.snapshot.paramMap.get('eObservationId'), 10))
        .then(eObservation => {
          this.eObservation = eObservation;
          this.originEObservation = _.cloneDeep(this.eObservation);
          const redactionDateString = this.datePipe.transform(this.eObservation.redactionDate, 'yyyyMMddHHmmss');
          const pncMatricule = this.eObservation && this.eObservation.pnc ? this.eObservation.pnc.matricule : '';
          this.pdfFileName = 'EOBS_' + pncMatricule + '_' + redactionDateString + '.pdf';
          if (this.eObservation && this.eObservation.pnc && this.eObservation.pnc.matricule) {
            this.pncService.getPnc(this.eObservation.pnc.matricule).then(pnc => {
              this.pnc = pnc;
            }, error => { });
          }
        }, error => { });
    }
  }

  /**
   * Vérifie si la page peut être quitter sans confirmation
   * 
   * @return true si on peut quitter la page sans demander confirmation
   */
  canDeactivate(): boolean {
    return !this.editMode || !this.formHasBeenModified();
  }

  /**
   * Vérifie si le formulaire a été modifié sans être enregistré
   */
  formHasBeenModified() {
    return Utils.getHashCode(this.originEObservation) !== Utils.getHashCode(this.eObservation);
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
   * Récupère les itemLevels referentiel de le l'item referentiel
   * @return la liste des ReferentialItemLevelModel
   */
  getRefItemLevelsByRefItem(): ReferentialItemLevelModel[] {
    const refItemLevels = new Array<ReferentialItemLevelModel>();
    let refItemLevel = new ReferentialItemLevelModel();
    refItemLevel.level = EObservationLevelEnum.LEVEL_1;
    refItemLevels.push(refItemLevel);
    refItemLevel = new ReferentialItemLevelModel();
    refItemLevel.level = EObservationLevelEnum.LEVEL_2;
    refItemLevels.push(refItemLevel);
    refItemLevel = new ReferentialItemLevelModel();
    refItemLevel.level = EObservationLevelEnum.LEVEL_3;
    refItemLevels.push(refItemLevel);
    refItemLevel = new ReferentialItemLevelModel();
    refItemLevel.level = EObservationLevelEnum.LEVEL_4;
    refItemLevels.push(refItemLevel);
    refItemLevel = new ReferentialItemLevelModel();
    refItemLevel.level = EObservationLevelEnum.NO;
    refItemLevels.push(refItemLevel);
    return refItemLevels;
  }

  /**
   * Récupère le label du type de l'eObs
   * @return le label à afficher
   */
  getTypeLabel(): string {
    if (!this.eObservation) {
      return '';
    }
    return EObservationTypeEnum.getLabel(this.eObservation.type);
  }

  /**
   * Récupère le label de l'option du type de l'eObs
   * @return le label à afficher
   */
  getDetailOptionType(): string {
    return this.eObservationService.getDetailOptionType(this.eObservation);
  }

  /**
   * Teste si le commentaire PNC peut être modifié
   * @return vrai si le commentaire peut être modifié, faux sinon
   */
  canEditPncComment(): boolean {
    return this.sessionService.getActiveUser().matricule === this.eObservation.pnc.matricule
      && (this.originEObservation.pncComment === '' || typeof (this.originEObservation.pncComment) === 'undefined')
      && this.eObservation.type !== EObservationTypeEnum.E_ALT
      && this.eObservation.type !== EObservationTypeEnum.E_PCB;
  }

  /**
   * Demande la confirmation de la validation du commentaire du pnc
   */
  confirmValidatePncComment() {
    this.alertCtrl.create({
      header: this.translateService.instant('EOBSERVATION.CONFIRM_VALIDATE_PNC_COMMENT.TITLE'),
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
    }).then(alert => alert.present());
  }

  /**
   * Valide le commentaire pnc de l'eObservation
   */
  validatePncComment() {
    this.loadingCtrl.create().then(loading => {
      loading.present();

      // On transmet un objet cloné pour éviter toute modif de l'objet par le service
      const eObservationClone = _.cloneDeep(this.eObservation);
      this.eObservationService.validatePncComment(eObservationClone).then(eObservation => {
        this.eObservation = eObservation;
        this.originEObservation = _.cloneDeep(this.eObservation);
        this.toastService.success(this.translateService.instant('EOBSERVATION.MESSAGES.SUCCESS.PNC_COMMENT_SAVED'));
        this.location.back();
      }, error => { }).then(() => {
        // Finally
        loading.dismiss();
      });
    });
  }


  /**
   * Met à jour l'eObservation
   */
  updateEObservation() {
    this.loadingCtrl.create().then(loading => {
      loading.present();

      // On transmet un objet cloné pour éviter toute modif de l'objet par le service
      const eObservationClone = _.cloneDeep(this.eObservation);
      this.eObservationService.updateEObservation(eObservationClone).then(eObservation => {
        this.eObservation = eObservation;
        this.originEObservation = _.cloneDeep(this.eObservation);
        this.editMode = false;
        if (this.eObservation.deleted) {
          this.toastService.success(this.translateService.instant('EOBSERVATION.MESSAGES.SUCCESS.DELETED'));
          this.location.back();
        } else {
          this.toastService.success(this.translateService.instant('EOBSERVATION.MESSAGES.SUCCESS.UPDATED'));
        }
      }, error => { }).then(() => {
        // Finally
        loading.dismiss();
      });
    });

  }

  /**
   * Confirmation de suppression de l'eObservation
   */
  confirmDeleteEObservation() {
    this.alertCtrl.create({
      header: this.translateService.instant('EOBSERVATION.CONFIRM_DELETE.TITLE'),
      message: this.translateService.instant('EOBSERVATION.CONFIRM_DELETE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('EOBSERVATION.CONFIRM_DELETE.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translateService.instant('EOBSERVATION.CONFIRM_DELETE.CONFIRM'),
          handler: () => this.isMarkedAsDeleted()
        }
      ]
    }).then(alert => alert.present());
  }

  /**
   * Marque l'eObs comme supprimée et appelle la méthode pour la mise à jour"
   */
  isMarkedAsDeleted() {
    this.eObservation.deleted = true;
    this.updateEObservation();
  }

  /**
   * Retourne un booléen en fonction de l'état du réseau
   */
  isConnected(): boolean {
    return !this.connectivityService.isConnected();
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.eObservation !== undefined;
  }

  /**
   * Vérifie si l'eObs est de type ePcb
   * @return true si l'eObs est de type ePcb, false sinon
   */
  isPcbEObs(): boolean {
    return this.checkEObsType(EObservationTypeEnum.E_PCB);
  }

  /**
   * Vérifie si le type de l'eObs est celui passé en paramètre
   * @param eObservationType type d'eObs à vérifier
   * @return true si l'eObs est du type du paramètre, false sinon
   */
  checkEObsType(eObservationType: EObservationTypeEnum): boolean {
    return this.eObservation && eObservationType === this.eObservation.type;
  }

  /**
   * Enclenche mode "édition"
   */
  enterEditMode() {
    this.editMode = true;
  }

  /**
   * Sort du mode "édition"
   */
  cancelEditMode() {
    if (this.formHasBeenModified()) {
      this.cancelChangesService.openCancelChangesPopup().then(confirm => {
        if (confirm) {
          this.editMode = false;
          this.eObservation = _.cloneDeep(this.originEObservation);
        }
      });
    } else {
      this.editMode = false;
      this.eObservation = _.cloneDeep(this.originEObservation);
    }
  }

  /**
   * Retourne la date de dernière modification, formatée pour l'affichage
   * @return la date de dernière modification au format dd/mm/
   */
  getLastUpdateDate(): string {
    return this.datePipe.transform(this.eObservation.lastUpdateDate, 'dd/MM/yyyy HH:mm');
  }
}
