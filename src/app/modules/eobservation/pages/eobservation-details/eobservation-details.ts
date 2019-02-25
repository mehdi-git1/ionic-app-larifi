import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { CrewMemberEnum } from '../../../../core/models/crew-member.enum';
import { ReferentialThemeModel } from '../../../../core/models/eobservation/referential-theme.model';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';
import { EobservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/referential-item-level.model';
import { TranslateService } from '@ngx-translate/core';
import { EObservationTypeEnum } from '../../../../core/enums/e-observations-type.enum';

@Component({
  selector: 'page-eobservation-details',
  templateUrl: 'eobservation-details.html',
})
export class EobservationDetailsPage {

  matPanelHeaderHeight = '48px';

  eObservation: EObservationModel;

  itemsSortedByTheme: EobservationItemsByTheme[] ;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translateService: TranslateService) {
   
  }

  ionViewDidEnter() {
    if (this.navParams.get('eObservation')) {
      this.eObservation = this.navParams.get('eObservation');
      this.itemsSortedByTheme = this.sortEObservationItemsByTheme();
      console.log(this.itemsSortedByTheme);
    }
  }

  /** Crée un objet CrewMemberEnum à partir d'un objet PncModel
   * @param pnc pnc à transformer
   */
  createCrewMemberObjectFromPnc(pnc: PncModel) {
    const crewMember: CrewMemberEnum = new CrewMemberEnum();
    crewMember.pnc = pnc;
    return crewMember;
  }

  sortEObservationItemsByTheme(): EobservationItemsByTheme[]{
    const itemsByTheme = new Array<EobservationItemsByTheme>();
    if (this.eObservation && this.eObservation.eobservationItems && this.eObservation.eobservationItems.length > 0) {
      for (let eObservationItem of this.eObservation.eobservationItems) {
        const eObservationTheme = eObservationItem.refItemLevel.item.theme;
        let themeToDisplay = itemsByTheme.find(element => eObservationTheme.label == element.referentialTheme.label);
        if (!themeToDisplay) {
          themeToDisplay = new EobservationItemsByTheme(eObservationTheme);
          itemsByTheme.push(themeToDisplay);
        }
        themeToDisplay.eObservationItems.push(eObservationItem);
      }
    }
    return itemsByTheme;
  }

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
    return this.eObservation && ( this.eObservation.eobservationFlights === null  || this.eObservation.eobservationFlights.length === 0);
  }

  /**
   * Définit la couleur en fonction du statut
   * 
   * @return 'green' si 'TAKEN_INTO_ACCOUNT' ou 'red' si 'NOT_TAKEN_INTO_ACCOUNT'
   */
  getColorStatusPoint() : string{
    if (this.eObservation && this.eObservation.state === 'TAKEN_INTO_ACCOUNT' ) {
      return 'green';
    } else if (this.eObservation && this.eObservation.state === 'NOT_TAKEN_INTO_ACCOUNT' ) {
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

}
