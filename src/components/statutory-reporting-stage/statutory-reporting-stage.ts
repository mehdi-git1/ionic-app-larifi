import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'statutory-reporting-stage',
  templateUrl: 'statutory-reporting-stage.html'
})
export class StatutoryReportingStageComponent {

  expandedHeight = '48px';

  @Input() stagesList;

}
