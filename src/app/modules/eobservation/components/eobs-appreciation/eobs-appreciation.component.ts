import { ReferentialThemeModel } from '../../../../core/models/eobservation/eobservation-referential-theme.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'eobs-appreciation',
  templateUrl: 'eobs-appreciation.component.html'
})
export class EObsAppreciationComponent {

  @Input() theme: ReferentialThemeModel;

  /**
   * Vérifie que l'appréciation contient des données à afficher
   *
   * @return true si il y a des données dans l'appréciation, sinon false
   */
  hasItems(): boolean {
    return this.theme.subThemes && this.theme.subThemes.length > 0;
  }
}
