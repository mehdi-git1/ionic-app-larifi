import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';
import { InterviewStateEnum } from '../../../../core/enums/professional-interview/interview-state.enum';
import { ProfessionalInterviewDetailsPage } from '../../../professional-interview/pages/professional-interview-details/professional-interview-details.page';

@Component({
  selector: 'professional-interview',
  templateUrl: 'professional-interview.component.html'
})

export class ProfessionalInterviewComponent {

  matPanelHeaderHeight = 'auto';

  @Input() professionalInterview: ProfessionalInterviewModel;

  constructor(
    private navCtrl: NavController
  ) {
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

  /**
   * Redirige vers le detail du bilan pro
   */
  goToProfessionalInterviewDetail(evt: Event) {
    evt.stopPropagation();
    this.navCtrl.push(ProfessionalInterviewDetailsPage, { eObservation: this.professionalInterview });
  }

}

