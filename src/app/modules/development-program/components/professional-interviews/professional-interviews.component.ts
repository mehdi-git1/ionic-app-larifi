
import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';

@Component({
  selector: 'professional-interviews',
  templateUrl: 'professional-interviews.component.html'
})

export class ProfessionalInterviewsComponent implements OnChanges {

  matPanelHeaderHeight = '41px';

  @Input() professionalInterviews: ProfessionalInterviewModel[];

  @Input() filterItems = false;

  @Input() legend = true;

  constructor() {
  }

  ngOnChanges() {
  }

}
