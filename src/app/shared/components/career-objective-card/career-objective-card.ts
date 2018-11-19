import { Component, ViewChild, Input } from '@angular/core';

import { OfflineIndicatorComponent } from './../offline-indicator/offline-indicator';
import {PncRole} from '../../../core/models/pncRole';
import {CareerObjective} from '../../../core/models/careerObjective';


@Component({
  selector: 'career-objective-card',
  templateUrl: 'career-objective-card.html'
})
export class CareerObjectiveCardComponent {

  // Expose l'enum au template
  PncRole = PncRole;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor() {
  }

  @Input() careerObjective: CareerObjective;

  @Input()
  set offlineAction(val: any) {
    this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
  }

}
