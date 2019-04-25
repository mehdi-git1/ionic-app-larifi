import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';
import { ProfessionalInterviewStateEnum } from '../../../../core/enums/professional-interview/professional-interview-state.enum';
import { ProfessionalInterviewDetailsPage } from '../../../professional-interview/pages/professional-interview-details/professional-interview-details.page';

@Component({
  selector: 'professional-interview',
  templateUrl: 'professional-interview.component.html'
})

export class ProfessionalInterviewComponent {

  matPanelHeaderHeight = 'auto';

  @Input() professionalInterview: ProfessionalInterviewModel;

  constructor(private navCtrl: NavController) {
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
        case ProfessionalInterviewStateEnum.AVAILABLE: return 'orange';
        case ProfessionalInterviewStateEnum.DRAFT: return 'grey';
      }
    }
  }

  /**
   * Redirige vers le detail du bilan pro
   */
  goToProfessionalInterviewDetail(evt: Event) {
    evt.stopPropagation();
    this.navCtrl.push(ProfessionalInterviewDetailsPage, { professionalInterview: this.professionalInterview });
  }

}

