import * as moment from 'moment';
import {
    BusinessIndicatorPopulationEnum
} from 'src/app/core/enums/business-indicators/business-indicator-population.enum';
import {
    BusinessIndicatorSummariesModel
} from 'src/app/core/models/business-indicator/business-indicator-summaries.model';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'business-indicator-comparison-table',
  templateUrl: './business-indicator-comparison-table.component.html',
  styleUrls: ['./business-indicator-comparison-table.component.scss'],
})
export class BusinessIndicatorComparisonTableComponent implements OnInit {

  @Input()
  businessIndicatorSummaries: BusinessIndicatorSummariesModel[];


  private readonly DATE_FORMAT = 'DD/MM/YYYY';

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  /**
   * Récupère le label à afficher pour la population donnée
   * @param populationType la population donnée
   * @returns le label
   */
  getPopulationLabel(populationType: string): string {
    return this.translateService.instant('BUSINESS_INDICATORS.LIST.PAST_SUMMARY.'.concat(populationType));
  }

  /**
   * Vérifie que le poste occupé est CC sur LC
   * @param population la population sur la période indiquée
   * @returns vrai si CC sur LC, faux sinon.
   */
  isPncCcLc(population: BusinessIndicatorPopulationEnum) {
    return BusinessIndicatorPopulationEnum.CC_LC === population;
  }

  /**
   * Vérifie que la valeur de l'indicateur est significative
   * @param value la valeur que l'on souhaite vérifier
   * @returns true si la valeur est significative, false sinon.
   */
  isIndicatorHasSignificantValue(value: any): boolean {
    return (value !== undefined && value !== -1);
  }

  /**
   * Affiche la date sous le format Jour/Mois/Année
   * @param date la date à formatter
   * @returns la date formatée.
   */
  getFormatedDate(date: string): string {
    return moment(date).format(this.DATE_FORMAT);
  }
}
