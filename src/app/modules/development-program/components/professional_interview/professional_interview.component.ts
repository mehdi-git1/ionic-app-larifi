import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-assessment/professional-assessment.model';

@Component({
  selector: 'professional-assessment',
  templateUrl: 'professional_interview.component.html'
})

export class ProfessionalInterviewComponent implements OnChanges {

  matPanelHeaderHeight = 'auto';

  @Input() professionalInterview: ProfessionalInterviewModel;

  constructor() {
  }

  ngOnChanges() {

  }
}
