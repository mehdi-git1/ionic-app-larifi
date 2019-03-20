
import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalAssessmentModel } from '../../../../core/models/professional-assessment/professional-assessment.model';

@Component({
  selector: 'professional-assessments',
  templateUrl: 'professional_assessments.component.html'
})

export class ProfessionalAssessmentsComponent implements OnChanges {

  matPanelHeaderHeight = '41px';
  isOlderThan3Years = false;
  nbOfYearsToChangeMessage = 3;

  @Input() professionalAssessments: ProfessionalAssessmentModel[];

  @Input() filterItems = false;

  @Input() legend = true;

  constructor() {
  }

  ngOnChanges() {
  }

}
