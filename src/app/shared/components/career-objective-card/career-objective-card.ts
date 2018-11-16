import { OfflineAction } from './../../models/offlineAction';
import { PncRole } from './../../models/pncRole';
import { CareerObjective } from './../../models/careerObjective';
import { OfflineIndicatorComponent } from './../offline-indicator/offline-indicator';
import { Component, ViewChild, Input, OnInit, OnChanges } from '@angular/core';

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
