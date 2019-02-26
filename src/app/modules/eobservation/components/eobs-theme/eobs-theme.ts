import { Component, Input } from '@angular/core';
import { EobservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { EobsItemDescriptionComponent } from '../eobs-item-description/eobs-item-description';
import { PopoverController } from 'ionic-angular';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';

@Component({
  selector: 'eobs-theme',
  templateUrl: 'eobs-theme.html'
})
export class EObsThemeComponent {

  @Input() theme: EobservationItemsByTheme;

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
  isEmptyGrid (): boolean {
    return this.theme.eObservationItems === null || this.theme.eObservationItems.length === 0;
  }

  openDescription(myEvent: Event, eObservationItem: EObservationItemModel) {
    let descriptions = new Array();
    if (eObservationItem && eObservationItem.refItemLevel && eObservationItem.refItemLevel.item && eObservationItem.refItemLevel.item.levels) {
      descriptions = eObservationItem.refItemLevel.item.levels;
    }
    const popover = this.popoverCtrl.create(EobsItemDescriptionComponent, {descriptions: eObservationItem.refItemLevel.item.levels}, {cssClass: 'description-popover'});
      popover.present({
        ev: myEvent
      });
  }

 }
