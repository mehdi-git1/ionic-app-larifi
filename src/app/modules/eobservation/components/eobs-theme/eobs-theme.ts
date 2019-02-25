import { Component, Input } from '@angular/core';
import { EobservationItemsByTheme } from '../../../../core/models/eobservation/eobservation-items-by-theme.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';

@Component({
  selector: 'eobs-theme',
  templateUrl: 'eobs-theme.html'
})
export class EObsThemeComponent {

  @Input() theme: EobservationItemsByTheme;

  constructor() {
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

 }
