import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalAssessmentModel } from '../../../../core/models/professional-assessment/professional-assessment.model';

@Component({
  selector: 'professional-assessment',
  templateUrl: 'professional_assessment.component.html'
})

export class ProfessionalAssessmentComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  @Input() professionalAssessment: ProfessionalAssessmentModel;

  constructor() {
  }

  ngOnChanges() {

  }
}
