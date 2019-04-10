import { ReferentialThemeModel } from './../../../../core/models/eobservation/referential-theme.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'eobs-appreciation',
  templateUrl: 'eobs-appreciation.component.html'
})
export class EObsAppreciationComponent {

  @Input() theme: ReferentialThemeModel;

  /**
   * Vérifie qu'il y a des items dans le theme
   *
   * @return true si il n'y a pas d'items dans ce thème, sinon false
   */
  hasItems(): boolean {
    return this.theme.eobservationItems === null || this.theme.eobservationItems.length === 0;
  }

}
