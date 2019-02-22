import { NavController } from 'ionic-angular';
import { CareerObjectiveCreatePage } from './../../pages/career-objective-create/career-objective-create.page';
import { CareerObjectiveStatusEnum } from './../../../../core/enums/career-objective-status.enum';
import { Component, ViewChild, Input } from '@angular/core';

import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';


@Component({
  selector: 'career-objective',
  templateUrl: 'career-objective.component.html'
})
export class CareerObjectiveComponent {

  // Expose l'enum au template
  PncRole = PncRoleEnum;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor() {
  }

  @Input() careerObjective: CareerObjectiveModel;

  @Input()
  set offlineAction(val: any) {
    if (this.offlineIndicatorComponent) {
      this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
    }
  }

  /**
   * Retourne la classe CSS associée au statut d'une priorité
   * @param careerObjectiveStatus le statut de la priorité
   * @return la classe CSS associée au statut
   */
  getStatusCssClass(careerObjectiveStatus: CareerObjectiveStatusEnum): string {
    if (CareerObjectiveStatusEnum.DRAFT == careerObjectiveStatus) {
      return 'draft-dot';
    } else if (CareerObjectiveStatusEnum.REGISTERED == careerObjectiveStatus) {
      return 'registered-dot';
    } else if (CareerObjectiveStatusEnum.VALIDATED == careerObjectiveStatus) {
      return 'validated-dot';
    } else if (CareerObjectiveStatusEnum.ABANDONED == careerObjectiveStatus) {
      return 'abandoned-dot';
    }
    return '';
  }

}
