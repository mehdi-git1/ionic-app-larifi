
import { Component, Input } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';

@Component({
  selector: 'professional-interviews',
  templateUrl: 'professional_interviews.component.html'
})

export class ProfessionalInterviewsComponent {

  matPanelHeaderHeight = '41px';
  professionalInterviewTab: ProfessionalInterviewModel[];

  @Input() legend = true;
  @Input()
  set professionalInterviews(val: any) {
    this.professionalInterviewTab = val.sort((pi: ProfessionalInterviewModel, otherPi: ProfessionalInterviewModel) => {
        return pi.annualProfessionalInterviewDate < otherPi.annualProfessionalInterviewDate ? 1 : -1;
      });
    }

}
