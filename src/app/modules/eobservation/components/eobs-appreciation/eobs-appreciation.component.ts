import { Component, Input } from '@angular/core';
import { EObservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';
import { EobsItemDescriptionComponent } from '../eobs-item-description/eobs-item-description.component';
import { PopoverController } from 'ionic-angular';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';

@Component({
  selector: 'eobs-appreciation',
  templateUrl: 'eobs-appreciation.component.html'
})
export class EObsAppreciationComponent {

  @Input() theme: EObservationItemsByTheme;

  /**
   * Vérifie qu'il y a des items dans le theme
   *
   * @return true si il n'y a pas d'items dans ce thème, sinon false
   */
  hasItems(): boolean {
    return this.theme.eObservationItems === null || this.theme.eObservationItems.length === 0;
  }

 }
