
import { Component, Input } from '@angular/core';

import {
    ProfessionalInterviewStateEnum
} from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';

@Component({
  selector: 'professional-interviews',
  templateUrl: 'professional-interviews.component.html',
  styleUrls: ['./professional-interviews.component.scss']
})

export class ProfessionalInterviewsComponent {

  matPanelHeaderHeight = '41px';
  professionalInterviewTab: ProfessionalInterviewModel[];

  @Input() legend = true;
  @Input()
  set professionalInterviews(val: any) {
    this.professionalInterviewTab = val.sort((professionalInterview: ProfessionalInterviewModel, professionalInterview2: ProfessionalInterviewModel) => {
      return professionalInterview.annualProfessionalInterviewDate < professionalInterview2.annualProfessionalInterviewDate ? 1 : -1;
    });
  }

  /**
   * Récupére le nombre de bilan pro / EPP réalisés (hors statut brouillon)
   * @return nombre de bilan pro
   */
  getNumberOfRealisedInterviews(): number {
    return this.professionalInterviewTab.filter(
      interview => interview.state != ProfessionalInterviewStateEnum.DRAFT
    ).length;
  }

}
