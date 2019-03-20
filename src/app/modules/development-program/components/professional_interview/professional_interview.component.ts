import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';

@Component({
  selector: 'professional-interview',
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
