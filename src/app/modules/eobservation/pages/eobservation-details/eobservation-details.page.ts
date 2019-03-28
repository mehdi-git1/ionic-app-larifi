import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { EobservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { EObservationStateEnum } from '../../../../core/enums/e-observation-state.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import * as _ from 'lodash';
import { Utils } from '../../../../shared/utils/utils';
import { AuthorizationService } from '../../../../core/services/authorization/authorization.service';

@Component({
  selector: 'page-eobservation-details',
  templateUrl: 'eobservation-details.page.html',
})
export class EobservationDetailsPage {
  PncRoleEnum = PncRoleEnum;

  eObservation: EObservationModel;
  originEObservation: EObservationModel;

  itemsSortedByTheme: EobservationItemsByTheme[];

  editMode = false;

  loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private eObservationService: EObservationService,
    private sessionService: SessionService,
    private translateService: TranslateService,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private authorizationService: AuthorizationService) {
    if (this.navParams.get('eObservation')) {
      this.eObservation = this.navParams.get('eObservation');
      this.originEObservation = _.cloneDeep(this.eObservation);

      this.itemsSortedByTheme = this.sortEObservationItemsByTheme();
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
    return Utils.getHashCode(this.originEObservation) !== Utils.getHashCode(this.eObservation);
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
   * Trie les items d'eobs par theme
   * @return la liste de EobservationItemsByTheme
   */
  sortEObservationItemsByTheme(): EobservationItemsByTheme[] {
    const itemsByTheme = new Array<EobservationItemsByTheme>();
    if (this.eObservation && this.eObservation.eobservationItems && this.eObservation.eobservationItems.length > 0) {
      for (const eObservationItem of this.eObservation.eobservationItems.sort((a, b) => a.itemOrder > b.itemOrder ? 1 : -1)) {
        const eObservationTheme = eObservationItem.refItemLevel.item.theme;
        let themeToDisplay = itemsByTheme.find(element => eObservationTheme.label == element.referentialTheme.label);
        if (!themeToDisplay) {
          themeToDisplay = new EobservationItemsByTheme(eObservationTheme);
          itemsByTheme.push(themeToDisplay);
        }
        themeToDisplay.eObservationItems.push(eObservationItem);
      }
    }
    return itemsByTheme.sort((a, b) => a.referentialTheme.themeOrder > b.referentialTheme.themeOrder ? 1 : -1);
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
  validatePncComment() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    // On transmet un objet cloné pour éviter toute modif de l'objet par le service
    const eObservationClone = _.cloneDeep(this.eObservation);
    this.eObservationService.validatePncComment(eObservationClone).then(eObservation => {
      this.eObservation = eObservation;
      this.originEObservation = _.cloneDeep(this.eObservation);
      this.toastService.success(this.translateService.instant('EOBSERVATION.MESSAGES.SUCCESS.PNC_COMMENT_SAVED'));
      this.navCtrl.pop();
    }, error => { }).then(() => {
      // Finally
      this.loading.dismiss();
    });
  }

  /**
   * Met à jour l'eObservation
   */
  updateEObservation() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    // On transmet un objet cloné pour éviter toute modif de l'objet par le service
    const eObservationClone = _.cloneDeep(this.eObservation);
    this.eObservationService.updateEObservation(eObservationClone).then(eObservation => {
      this.eObservation = eObservation;
      this.originEObservation = _.cloneDeep(this.eObservation);
      this.toastService.success(this.translateService.instant('EOBSERVATION.MESSAGES.SUCCESS.UPDATED'));
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
    return this.eObservation !== undefined;
  }

  /**
   * Teste s'il est possible d'éditer l'eObs
   * @return true si c'est le cas, faux sinon
   */
  canEditEObs(): boolean {
    return this.authorizationService.hasPermission('EOBS_FULL_EDITION');
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
    this.editMode = false;
    this.eObservation = _.cloneDeep(this.originEObservation);
  }
}
