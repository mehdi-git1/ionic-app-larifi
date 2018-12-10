import { Component, ViewChild, Input } from '@angular/core';

import { OfflineIndicatorComponent } from '../../../../shared/components/offline-indicator/offline-indicator.component';
import {PncRoleEnum} from '../../../../core/enums/pnc-role.enum';
import {CareerObjectiveModel} from '../../../../core/models/career-objective.model';


@Component({
  selector: 'career-objective-card',
  templateUrl: 'career-objective-card.component.html'
})
export class CareerObjectiveCardComponent {

  // Expose l'enum au template
  PncRole = PncRoleEnum;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor() {
  }

  @Input() careerObjective: CareerObjectiveModel;

  @Input()
  set offlineAction(val: any) {
    this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
  }

}
