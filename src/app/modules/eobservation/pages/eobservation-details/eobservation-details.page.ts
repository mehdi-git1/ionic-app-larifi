import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { EObservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../core/services/toast/toast.service';
import * as _ from 'lodash';
import { Utils } from '../../../../shared/utils/utils';
import { AuthorizationService } from '../../../../core/services/authorization/authorization.service';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';
import { ReferentialThemeModel } from '../../../../core/models/eobservation/referential-theme.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
  selector: 'page-eobservation-details',
  templateUrl: 'eobservation-details.page.html',
})
export class EobservationDetailsPage {
  PncRoleEnum = PncRoleEnum;
  EObservationTypeEnum = EObservationTypeEnum;

  eObservation: EObservationModel;
  pnc: PncModel;
  originEObservation: EObservationModel;

  itemsSortedByTheme: EObservationItemsByTheme[];

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
    private authorizationService: AuthorizationService,
    private pncService: PncService) {
    if (this.navParams.get('eObservation')) {
      this.eObservation = this.navParams.get('eObservation');
      this.originEObservation = _.cloneDeep(this.eObservation);
      if (this.eObservation && this.eObservation.pnc && this.eObservation.pnc.matricule) {
        this.pncService.getPnc(this.eObservation.pnc.matricule).then(pnc => {
          this.pnc = pnc;
        }, error => { });
      }
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
   * @return la liste de EObservationItemsByTheme
   */
  sortEObservationItemsByTheme(): EObservationItemsByTheme[] {
    const itemsByTheme = new Array<EObservationItemsByTheme>();
    if (this.eObservation && this.eObservation.eobservationItems && this.eObservation.eobservationItems.length > 0) {
      for (const eObservationItem of this.eObservation.eobservationItems.sort((a, b) => a.itemOrder > b.itemOrder ? 1 : -1)) {
        const eObservationTheme = eObservationItem.refItemLevel.item.theme;
        this.manageThemeInMap(eObservationItem, eObservationTheme, itemsByTheme, null);
      }
    }
    let items = itemsByTheme.sort((a, b) => a.referentialTheme.themeOrder > b.referentialTheme.themeOrder ? 1 : -1);
    items = this.addCommentsToThemes(items);
    return items;
  }

  /**
   * Organise les items en fonction des themes et des thèmes parent
   * @param eObservationItem item à ranger
   * @param eObservationTheme theme qui contient l'item
   * @param itemsByTheme map des themes/items déjà rangés
   * @param parentThemeToDisplay theme parent si il existe
   * @return tableau de EObservationItemsByTheme
   */
  manageThemeInMap(eObservationItem: EObservationItemModel,
    eObservationTheme: ReferentialThemeModel,
    itemsByTheme: Array<EObservationItemsByTheme>,
    parentThemeToDisplay: EObservationItemsByTheme): Array<EObservationItemsByTheme> {
    const parentTheme = eObservationTheme.parent;
    if (parentTheme) {
      if (!parentThemeToDisplay) {
        parentThemeToDisplay = itemsByTheme.find(element => parentTheme.id === element.referentialTheme.id);
        if (!parentThemeToDisplay) {
          parentThemeToDisplay = new EObservationItemsByTheme(parentTheme);
        }
      }
      let subThemeAlreadyStored = true;
      let themeToDisplay = parentThemeToDisplay.subThemes.find(element => eObservationTheme.id === element.referentialTheme.id);
      if (!themeToDisplay) {
        themeToDisplay = new EObservationItemsByTheme(eObservationTheme);
        subThemeAlreadyStored = false;
      }
      themeToDisplay.eObservationItems.push(eObservationItem);
      if (!subThemeAlreadyStored) {
        parentThemeToDisplay.subThemes.push(themeToDisplay);
      }
      this.manageThemeInMap(eObservationItem, parentTheme, itemsByTheme, parentThemeToDisplay);
    } else {
      let themeToDisplay = itemsByTheme.find(element => eObservationTheme.id === element.referentialTheme.id);
      if (!themeToDisplay) {
        themeToDisplay = new EObservationItemsByTheme(eObservationTheme);
        itemsByTheme.push(themeToDisplay);
      }
      themeToDisplay.eObservationItems.push(eObservationItem);
    }
    return itemsByTheme;
  }

  /**
   * Ajoute les commentaires aux thèmes
   * 
   * @param itemsByTheme tableau d'items rangés par thème
   * @return tableau d'items rangés par thème avec les commentaires de thèmes
   */
  addCommentsToThemes(itemsByTheme: Array<EObservationItemsByTheme>): Array<EObservationItemsByTheme> {
    if (this.eObservation && this.eObservation.eobservationComments && this.eObservation.eobservationComments.length > 0) {
      for (const eObservationComment of this.eObservation.eobservationComments) {
        const eObservationTheme = eObservationComment.refComment.theme;
        let themeToDisplay = itemsByTheme.find(element => eObservationTheme.id === element.referentialTheme.id);
        themeToDisplay.eObservationComment = eObservationComment;
      }
    }
    return itemsByTheme;
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
   * Sort du mode "édition"
   * Vérifie si l'eObs est de type ePcb
   * @return true si l'eObs est de type ePcb, false sinon
   */
  isPcbEObs(): boolean {
    return this.eObservation && EObservationTypeEnum.E_PCB === this.eObservation.type;
  }

  /**
   * Enclenche mode "édition" 
   */
  enterEditMode() {
    this.editMode = true;
  }

  /**
   * Teste si un utilisateur est admin métier des eObservations
   * @return vrai si l'utilisateur est admin métier des EObservations, faux sinon
   */
  cancelEditMode() {
    this.editMode = false;
    this.eObservation = _.cloneDeep(this.originEObservation);
    this.itemsSortedByTheme = this.sortEObservationItemsByTheme();
  }

  /**
   * Mise à jour des commentaires des eObs.
   * @param newCommentEvent événement contenant l'id et le nouveau commentaire
   */
  updateEObservationComment(newCommentEvent: any) {
    this.eObservation.eobservationComments.find(eobservationComment => {
      return eobservationComment.techId === newCommentEvent.techId;
    }).comment = newCommentEvent.comment;
  }
}
