import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstant } from 'src/app/app.constant';
import { CareerObjectiveCategory } from 'src/app/core/models/career-objective-category';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { CareerObjectiveDisplayModeEnum } from '../../../../core/enums/career-objective/career-objective-display-mode.enum';
import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { TranslateService } from '@ngx-translate/core'; // Assuming you're using ngx-translate for translations

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

  isPopoverOpen = false;
  popoverEvent: any;
  selectedCategoryCode: string = this.valueAll;
  selectedCategoryLabel: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pncService: PncService,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private translateService: TranslateService
  ) {
    if (this.sessionService.getActiveUser().appInitData !== undefined) {
      this.careerObjectiveCategories = this.sessionService.getActiveUser().appInitData.careerObjectiveCategories;
    }
    this.updateSelectedCategoryLabel();
  }

  openPopover(event: any) {
    this.popoverEvent = event;
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  changeCategory(categoryCode: string) {
    this.selectedCategoryCode = categoryCode;
    this.updateSelectedCategoryLabel();
    this.filterCategory(categoryCode);
    this.closePopover();
  }

  updateSelectedCategoryLabel() { 
    if (this.selectedCategoryCode === this.valueAll) {
      this.selectedCategoryLabel = this.translateService.instant('CAREER_OBJECTIVE_LIST.SEARCH.ALL');
    } else {
      const selectedCategory = this.careerObjectiveCategories.find(c => c.code === this.selectedCategoryCode);
      this.selectedCategoryLabel = selectedCategory ? selectedCategory.label : '';
    }
  }

  filterCategory(filter: string) { 
    this.categorySelected.emit(filter);
  }

  isConnected(): boolean {
    return this.connectivityService.isConnected();
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
}