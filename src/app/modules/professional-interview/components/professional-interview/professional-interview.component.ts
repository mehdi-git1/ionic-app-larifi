import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
    ProfessionalInterviewStateEnum
} from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import {
    ProfessionalInterviewModel
} from '../../../../core/models/professional-interview/professional-interview.model';

@Component({
  selector: 'professional-interview',
  templateUrl: 'professional-interview.component.html',
  styleUrls: ['./professional-interview.component.scss']
})

export class ProfessionalInterviewComponent {

  matPanelHeaderHeight = 'auto';

  @Input() professionalInterview: ProfessionalInterviewModel;

  @Output() detailButtonClicked = new EventEmitter();

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
        case ProfessionalInterviewStateEnum.TAKEN_INTO_ACCOUNT: return 'green';
        case ProfessionalInterviewStateEnum.NOT_TAKEN_INTO_ACCOUNT: return 'red';
        case ProfessionalInterviewStateEnum.CONSULTED: return 'orange';
        case ProfessionalInterviewStateEnum.DRAFT: return 'grey';
      }
    }
  }

  /**
   * Redirige vers le détail du bilan pro
   */
  goToProfessionalInterviewDetail(evt: Event) {
    evt.stopPropagation();
    this.detailButtonClicked.emit(this.professionalInterview.techId);
  }

}

