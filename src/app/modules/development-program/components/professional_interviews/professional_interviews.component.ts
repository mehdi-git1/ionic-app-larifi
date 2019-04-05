
import { Component, Input } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';

@Component({
  selector: 'professional-interviews',
  templateUrl: 'professional_interviews.component.html'
})

export class ProfessionalInterviewsComponent {

  matPanelHeaderHeight = '41px';

  @Input() professionalInterviews: ProfessionalInterviewModel[];
  @Input() filterItems = false;
  @Input() legend = true;

}
