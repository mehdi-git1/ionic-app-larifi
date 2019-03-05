import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ReferentialThemeModel } from '../../../../core/models/eobservation/referential-theme.model';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';
import { EobservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { TranslateService } from '@ngx-translate/core';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';
import { EObservationFlightModel } from '../../../../core/models/eobservation/eobservation-flight.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { EObservationStateEnum } from '../../../../core/enums/e-observation-state.enum';
import { CrewMemberModel } from '../../../../core/models/crew-member.model';

@Component({
  selector: 'page-eobservation-details',
  templateUrl: 'eobservation-details.page.html',
})
export class EobservationDetailsPage {
  eObservation: EObservationModel;

  itemsSortedByTheme: EobservationItemsByTheme[] ;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private eObservationService: EObservationService) {
  }

  ionViewDidEnter() {
    if (this.navParams.get('eObservation')) {
      this.eObservation = this.navParams.get('eObservation');
      this.itemsSortedByTheme = this.sortEObservationItemsByTheme();
    }
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
  sortEObservationItemsByTheme(): EobservationItemsByTheme[]{
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
  getRefItemLevelsByRefItem(): ReferentialItemLevelModel[]{
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
   * Vérifie qu'il y a des vols
   *
   * @return true si il n'y a pas de vols dans cette eobs, sinon false
   */
  hasFlights(): boolean {
    if ( !this.eObservation || !this.eObservation.eobservationFlights || this.eObservation.eobservationFlights.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * Définit la couleur en fonction du statut
   *
   * @return 'green' si 'TAKEN_INTO_ACCOUNT' ou 'red' si 'NOT_TAKEN_INTO_ACCOUNT'
   */
  getColorStatusPoint(): string{
    if (this.eObservation && this.eObservation.state === EObservationStateEnum.TAKEN_INTO_ACCOUNT ) {
      return 'green';
    } else if (this.eObservation && this.eObservation.state === EObservationStateEnum.NOT_TAKEN_INTO_ACCOUNT ) {
      return 'red';
    }
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
   * Définit si la periode temporaire est affichable
   * @return true si 'ECC' ou 'ECCP' et si l'une des valeurs "vol de formation" ou "val" est true
   */
  hasTemporaryPeriodToBeDisplayed(): boolean {
    return this.eObservation
    && (this.eObservation.type === EObservationTypeEnum.E_CC || this.eObservation.type === EObservationTypeEnum.E_CCP )
    && (this.eObservation.formationFlight || this.eObservation.val);
  }

  /**
   * Trie les vols de l'eobs
   */
  sortedFlights(): EObservationFlightModel[] {
    if (this.eObservation && this.eObservation.eobservationFlights) {
      return this.eObservation.eobservationFlights.sort((a, b) => a.flightOrder > b.flightOrder ? 1 : -1);
    }
    return new Array();
  }

}
