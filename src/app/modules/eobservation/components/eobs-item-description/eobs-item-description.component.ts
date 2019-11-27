import { Component } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import {
    ReferentialItemLevelModel
} from '../../../../core/models/eobservation/eobservation-referential-item-level.model';

@Component({
  selector: 'eobs-item-description',
  templateUrl: 'eobs-item-description.component.html',
  styleUrls: ['./eobs-item-description.component.scss']
})
export class EobsItemDescriptionComponent {

  descriptions: ReferentialItemLevelModel[];

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController) {
    const descriptions: ReferentialItemLevelModel[] = this.navParams.get('descriptions');
    this.descriptions = this.sortDescriptionsByLevel(descriptions);
  }

  /**
   * Trie la liste des descriptions par niveau
   * @param descriptions liste de descriptions
   * @return liste de descriptions triées
   */
  sortDescriptionsByLevel(descriptions: ReferentialItemLevelModel[]): ReferentialItemLevelModel[] {
    return descriptions.sort((a, b) => a.level < b.level ? 1 : -1);
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
   * Récupère le label à afficher par rapport au niveau donné
   * @param level le niveau de l'eObservation
   * @return le label à afficher
   */
  getDescriptionClass(level: EObservationLevelEnum): string {
    return 'description-' + level.toLowerCase();
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.popoverCtrl.dismiss();
  }
}
