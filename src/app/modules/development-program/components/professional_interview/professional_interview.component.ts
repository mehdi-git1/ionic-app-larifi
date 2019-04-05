import { Component, Input, OnChanges } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';
import { InterviewStateEnum } from '../../../../core/enums/professional-interview/interview-state.enum';

@Component({
  selector: 'professional-interview',
  templateUrl: 'professional_interview.component.html'
})

export class ProfessionalInterviewComponent {

  matPanelHeaderHeight = 'auto';

  @Input() professionalInterview: ProfessionalInterviewModel;

  constructor() {
  }

  /**
     * Définit la couleur en fonction du statut
     *
     * @return 'green' si 'TAKEN_INTO_ACCOUNT' ou 'red' si 'NOT_TAKEN_INTO_ACCOUNT'
     */
  getColorStatusPoint(): string {
    if (this.professionalInterview) {
      switch (this.professionalInterview.state) {
        case InterviewStateEnum.TAKEN_INTO_ACCOUNT: return 'green';
        case InterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT: return 'red';
        case InterviewStateEnum.CONSULTED: return 'orange';
        case InterviewStateEnum.DRAFT: return 'grey';
      }
    }
  }

}
