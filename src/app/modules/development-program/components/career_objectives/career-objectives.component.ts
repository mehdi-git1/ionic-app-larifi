

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';

@Component({
  selector: 'career-objectives',
  templateUrl: 'career-objectives.component.html',
  styleUrls: ['./career-objectives.component.scss']
})

export class CareerObjectivesComponent {

  matPanelHeaderHeight = '41px';

  @Input() careerObjectives: CareerObjectiveModel[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  /**
   * Ouvre un objectif => redirige vers la page de création de l'objectif
   * @param careerObjective L'objectif à ouvrir
   */
  openCareerObjective(careerObjective: CareerObjectiveModel) {
    this.router.navigate(['create', careerObjective.techId], { relativeTo: this.activatedRoute });
  }
}
