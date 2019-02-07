import { Component, Input } from '@angular/core';
import { EObservationItemModel } from '../../../../core/models/eobservation/eobservation-item.model';
import { EObservationLevelEnum } from '../../../../core/enums/e-observations-level.enum';

@Component({
  selector: 'abnormal-level',
  templateUrl: 'abnormal-level.component.html'
})
export class AbnormalLevelComponent {

  @Input() abnormalEObservationItems: EObservationItemModel[];

  /**
   * Récupère le label à afficher par rapport au niveau donné
   * @param level le niveau de l'eObservation
   * @return le label à afficher
   */
  getLevelLabel(level: EObservationLevelEnum): string {
    return EObservationLevelEnum.getLabel(level);
  }

}
