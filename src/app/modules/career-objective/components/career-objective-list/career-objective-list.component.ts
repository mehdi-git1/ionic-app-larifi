import { EventEmitter } from 'events';
import { CareerObjectiveCategory } from 'src/app/core/models/career-objective-category';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    CareerObjectiveDisplayModeEnum
} from '../../../../core/enums/career-objective/career-objective-display-mode.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
  selector: 'career-objective-list',
  templateUrl: 'career-objective-list.component.html',
  styleUrls: ['career-objective-list.component.scss']
})
export class CareerObjectiveListComponent {

  @Input() careerObjectives: CareerObjectiveModel[];
  @Input() displayMode: CareerObjectiveDisplayModeEnum;

  @Output() selectedCategory = new EventEmitter();

  CareerObjectiveDisplayModeEnum = CareerObjectiveDisplayModeEnum;

  careerObjectiveCategories: CareerObjectiveCategory[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pncService: PncService,
    private sessionService: SessionService) {

    if (this.sessionService.getActiveUser().appInitData !== undefined) {
      this.careerObjectiveCategories = this.sessionService.getActiveUser().appInitData.careerObjectiveCategories;
    }
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.router.navigate(['../', 'career-objective', 'create', 0], { relativeTo: this.activatedRoute });
  }

  /**
   * Renvoie la spécialité du pnc à afficher
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  getFormatedSpeciality(pnc: PncModel): string {
    return this.pncService.getFormatedSpeciality(pnc);
  }

  /**
     * filtre par categorie
     * @param filter L'id de la categorie
     */
  filterCategory(filter: string) {
    this.hrDocumentFilter.categoryId = filter;
    this.searchHrDocuments();
  }
}
