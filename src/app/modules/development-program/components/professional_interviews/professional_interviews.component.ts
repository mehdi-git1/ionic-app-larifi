
import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-assessment/professional-assessment.model';

@Component({
  selector: 'professional-assessments',
  templateUrl: 'professional_interviews.component.html'
})

export class ProfessionalInterviewsComponent implements OnChanges {

  matPanelHeaderHeight = '41px';
  isOlderThan3Years = false;
  nbOfYearsToChangeMessage = 3;

  @Input() professionalInterviews: ProfessionalInterviewModel[];

  @Input() filterItems = false;

  @Input() legend = true;

  constructor() {
  }

  ngOnChanges() {
  }

}
