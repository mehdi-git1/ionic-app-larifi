import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'professional-level-stage',
  templateUrl: 'professional-level-stage.html'
})
export class ProfessionalLevelStageComponent {

  expandedHeight = '48px';

  @Input() stagesList;

}
