import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
  selector: 'career-objective-list',
  templateUrl: 'career-objective-list.component.html',
})
export class CareerObjectiveListComponent implements OnInit {

  @Input() careerObjectives: CareerObjectiveModel[];
  matricule: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pncService: PncService) {
  }

  ngOnInit() {
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.router.navigate(['career-objective', 'create', 0], { relativeTo: this.activatedRoute });
  }

  /**
   * Renvoie la spécialité du pnc à afficher
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  getFormatedSpeciality(pnc: PncModel): string {
    return this.pncService.getFormatedSpeciality(pnc);
  }
}
