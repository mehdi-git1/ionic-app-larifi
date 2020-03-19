import { AppConstant } from 'src/app/app.constant';
import { CareerObjectiveCategory } from 'src/app/core/models/career-objective-category';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { SessionService } from 'src/app/core/services/session/session.service';

import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() categorySelected = new EventEmitter<string>();

  valueAll = AppConstant.ALL;

  CareerObjectiveDisplayModeEnum = CareerObjectiveDisplayModeEnum;

  careerObjectiveCategories: CareerObjectiveCategory[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pncService: PncService,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService) {

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
    this.categorySelected.emit(filter);
  }

  /**
   * Vérifie si l'on est connecté
   * @return true si on est connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }
}
