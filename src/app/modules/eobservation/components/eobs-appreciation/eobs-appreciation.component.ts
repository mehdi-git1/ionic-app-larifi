import * as _ from 'lodash';

import { AfterViewInit, Component, Input } from '@angular/core';

import {
    EObservationItemModel
} from '../../../../core/models/eobservation/eobservation-item.model';
import {
    ReferentialItemLevelModel
} from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import {
    ReferentialThemeModel
} from '../../../../core/models/eobservation/eobservation-referential-theme.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';

@Component({
  selector: 'eobs-appreciation',
  templateUrl: 'eobs-appreciation.component.html',
  styleUrls: ['./eobs-appreciation.component.scss']
})
export class EObsAppreciationComponent implements AfterViewInit {

  @Input() theme: ReferentialThemeModel;

  @Input() editMode = false;

  referentialItemLevels: Array<ReferentialItemLevelModel>;

  constructor(private eObservationService: EObservationService) {

  }

  ngAfterViewInit() {
    this.eObservationService.getAllPcbReferentialItemLevelsByVersion('1,0').then(referentialItemLevels => {
      this.referentialItemLevels = referentialItemLevels;
    });
  }

  /**
   * Vérifie que l'appréciation contient des données à afficher
   *
   * @return true si il y a des données dans l'appréciation, sinon false
   */
  hasItems(): boolean {
    return this.theme.subThemes && this.theme.subThemes.length > 0;
  }

  /**
   * Trie la liste des levels
   * @param levelList la liste des levels
   * @return la liste des levels trié par ordre desc
   */
  sortLevelList(levelList: ReferentialItemLevelModel[]): ReferentialItemLevelModel[] {
    return levelList.sort((a, b) => a.level < b.level ? 1 : -1);
  }

  /**
   * Verifie si l'item est coché ou pas
   * @param eobservationItem l'item concerné
   * @Return vrai si oui, faux sinon
   */
  isChecked(eobservationItem: EObservationItemModel): boolean {
    return this.hasItems() ? this.theme.subThemes.find(theme => {
      return theme.subThemes && theme.subThemes.length > 0 && theme.subThemes[0].eobservationItems.find(item => eobservationItem.techId === item.refItemLevel.item.techId) !== undefined;
    }) !== undefined : false;
  }

  /**
   * Renvoie les items référentiels du thème concerné
   * @param subThemeId l'id du thème concerné
   * @return la liste des items référentiels concernés
   */
  getReferentialItemLevels(subThemeId: number): ReferentialItemLevelModel[] {
    return this.referentialItemLevels.filter(refItemLevel => refItemLevel.item.theme.parent.id === subThemeId);
  }

  /**
   * Ajout/supprime un item à la liste des itéms d'une eobs
   * @param event l'évent quand l'item est sélectionné/déselectionné
   * @param subThemeIndex l'index du subthème concerné dans la liste des subthèmes de l'eobservation
   * @param refItemLevel l'item référentiel à associé a l'item à ajouter
   */
  addOrRemoveCheckedOption(event: any, subThemeIndex: number, refItemLevel: ReferentialItemLevelModel) {
    if (event.detail.checked) {
      const eObservationItem = new EObservationItemModel();
      eObservationItem.refItemLevel = refItemLevel;
      eObservationItem.itemOrder = refItemLevel.item.itemOrder;
      if (this.theme.subThemes[subThemeIndex].subThemes.length === 0) {
        const subTheme = _.cloneDeep(refItemLevel.item.theme);
        subTheme.parent = null;
        this.theme.subThemes[subThemeIndex].subThemes.push(subTheme);
      }
      this.theme.subThemes[subThemeIndex].subThemes[0].eobservationItems.push(eObservationItem);
    } else {
      this.theme.subThemes[subThemeIndex].subThemes[0].eobservationItems = this.theme.subThemes[subThemeIndex].subThemes[0].eobservationItems.filter(item => item.refItemLevel.techId !== refItemLevel.techId);
    }
  }

}
