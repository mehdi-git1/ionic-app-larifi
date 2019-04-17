import { EObservationModel } from './../../../../core/models/eobservation/eobservation.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { EobsItemDescriptionComponent } from '../eobs-item-description/eobs-item-description.component';
import { PopoverController } from 'ionic-angular';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';
import { ReferentialThemeModel } from '../../../../core/models/eobservation/eobservation-referential-theme.model';

@Component({
  selector: 'eobs-theme',
  templateUrl: 'eobs-theme.component.html'
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
   * Ouvre la popover de description d'un item
   * @param myEvent  event
   * @param eObservationItem item
   */
  openDescription(myEvent: Event, eObservationItem: EObservationItemModel) {
    let _descriptions = new Array();
    if (eObservationItem && eObservationItem.refItemLevel && eObservationItem.refItemLevel.item && eObservationItem.refItemLevel.item.levels) {
      _descriptions = eObservationItem.refItemLevel.item.levels;
    }
    const popover = this.popoverCtrl.create(EobsItemDescriptionComponent, { descriptions: _descriptions }, { cssClass: 'description-popover' });
    popover.present({
      ev: myEvent
    });
  }

}
