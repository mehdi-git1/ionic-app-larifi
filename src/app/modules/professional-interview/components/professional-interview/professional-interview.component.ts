import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
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
    this.router.navigate(['professional-interview', 'detail', this.professionalInterview.techId], { relativeTo: this.activatedRoute });
  }

}

