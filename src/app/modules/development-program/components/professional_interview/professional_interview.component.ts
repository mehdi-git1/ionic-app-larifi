import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfessionalInterviewModel } from '../../../../core/models/professional-interview/professional-interview.model';
import { ProfessionalInterviewDetailsPage } from '../../../professional-interview/pages/professional-interview-details/professional-interview-details.page';


@Component({
  selector: 'professional-interview',
  templateUrl: 'professional_interview.component.html'
})

export class ProfessionalInterviewComponent {

  matPanelHeaderHeight = 'auto';

  @Input() professionalInterview: ProfessionalInterviewModel;

  constructor(
    private navCtrl: NavController
  ) {
  }

  /**
    * Redirige vers le détail d'une eObservation
    * @param evt event
    */
  goToProfessionalInterviewDetail(evt: Event): void {
    evt.stopPropagation();
    this.navCtrl.push(ProfessionalInterviewDetailsPage, { professionalInterview: this.professionalInterview });
  }
}
