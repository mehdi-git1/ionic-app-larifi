import { NavController } from 'ionic-angular';
import { CareerObjectiveCreatePage } from './../../pages/career-objective-create/career-objective-create.page';
import { CareerObjectiveModel } from './../../../../core/models/career-objective.model';
import { Component, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'career-objectives',
  templateUrl: 'career-objectives.component.html'
})

export class CareerObjectivesComponent {

  matPanelHeaderHeight = '41px';

  @Input() careerObjectives: CareerObjectiveModel[];

  constructor(private navCtrl: NavController) {
  }

  /**
 * Ouvre un objectif => redirige vers la page de création de l'objectif
 * @param careerObjectiveId l'id de l'objectif à ouvrir
 */
  openCareerObjective(careerObjective: CareerObjectiveModel) {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: careerObjective.pnc.matricule, careerObjectiveId: careerObjective.techId });
  }
}
