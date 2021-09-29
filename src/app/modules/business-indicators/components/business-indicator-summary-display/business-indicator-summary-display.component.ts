import {
    BusinessIndicatorPopulationEnum
} from 'src/app/core/enums/business-indicators/business-indicator-population.enum';
import {
    BusinessIndicatorSummaryModel
} from 'src/app/core/models/business-indicator/business-indicator-summary.model';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'business-indicator-summary-display',
  templateUrl: './business-indicator-summary-display.component.html',
  styleUrls: ['./business-indicator-summary-display.component.scss'],
})
export class BusinessIndicatorSummaryDisplayComponent implements OnInit {

  @Input()
  businessIndicatorSummary: BusinessIndicatorSummaryModel;

  constructor(private translateService: TranslateService) { }

  ngOnInit() { }


  /**
   * Vérifie que le poste occupé est CC sur LC.
   * @param population la population du pnc
   * @returns vrai si c'est le cas, faux sinon
   */
  isCCLC(population: BusinessIndicatorPopulationEnum) {
    return BusinessIndicatorPopulationEnum.CC_LC === population;
  }


  /**
   * Teste si la valeur existe
   * @param value la valeur à tester
   * @returns vrai si c'est le cas, faux sinon
   */
  isDefined(value: any): boolean {
    return value !== null && value !== undefined;
  }
}
