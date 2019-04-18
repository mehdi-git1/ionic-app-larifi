import { Component, Input } from '@angular/core';
import { ReferentialItemLevelModel } from '../../../../core/models/eobservation/eobservation-referential-item-level.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'eobs-item-description',
  templateUrl: 'eobs-item-description.component.html'
})
export class EobsItemDescriptionComponent {

  descriptions: ReferentialItemLevelModel[];

  constructor(private navParams: NavParams, public viewCtrl: ViewController) {
    const descriptions: ReferentialItemLevelModel[] = this.navParams.get('descriptions');
    this.descriptions = descriptions.sort((a, b) => a.level < b.level ? 1 : -1);
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
    this.viewCtrl.dismiss();
  }
}
