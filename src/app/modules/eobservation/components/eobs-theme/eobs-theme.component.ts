import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import {
    EObservationItemModel
} from '../../../../core/models/eobservation/eobservation-item.model';
import {
    ReferentialItemLevelModel
} from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import {
    ReferentialThemeModel
} from '../../../../core/models/eobservation/eobservation-referential-theme.model';
import {
    EobsItemDescriptionComponent
} from '../eobs-item-description/eobs-item-description.component';

@Component({
  selector: 'eobs-theme',
  templateUrl: 'eobs-theme.component.html',
  styleUrls: ['./eobs-theme.component.scss']
})
export class EObsThemeComponent {

  @Input() theme: ReferentialThemeModel;

  @Input() editMode = false;

  constructor(public popoverCtrl: PopoverController) {
  }

  /**
   * Récupère le label à afficher par rapport au niveau donné
   * @param level le niveau de l'eObservation
   * @return le label à afficher
   */
  getLevelLabel(level: EObservationLevelEnum): string {
    return EObservationLevelEnum.getLabel(level);
  }

  /**
   * Vérifie qu'il y a des items
   *
   * @return true si il n'y a pas d'items dans ce thème, sinon false
   */
  hasItemAndSubThemes(): boolean {
    return (this.theme.eobservationItems === null || this.theme.eobservationItems.length === 0)
      && !this.hasSubThemes();
  }

  /**
   * Vérifie qu'il y a des subThemes
   * @return true si il n'y a pas de subThemes dans ce thème, sinon false
   */
  hasSubThemes(): boolean {
    return !(this.theme.subThemes === null || this.theme.subThemes.length === 0);
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
   * Ouvre la popover de description d'un item
   * @param event  event
   * @param eObservationItem item
   */
  openDescription(event: Event, eObservationItem: EObservationItemModel) {
    let descriptions = new Array();
    if (eObservationItem && eObservationItem.refItemLevel && eObservationItem.refItemLevel.item
      && eObservationItem.refItemLevel.item.levels) {
      descriptions = eObservationItem.refItemLevel.item.levels;
    }
    this.popoverCtrl.create({
      component: EobsItemDescriptionComponent,
      componentProps: { descriptions: descriptions },
      event: event,
      cssClass: 'eobs-item-description-popover'
    }).then(popover => {
      popover.present();
    });
  }
}
