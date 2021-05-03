import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AppConstant } from 'src/app/app.constant';
import { BusinessIndicatorComparisonModel } from 'src/app/core/models/business-indicator/business-indicator-comparison-model';
import { PncModel } from 'src/app/core/models/pnc.model';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

@Component({
  selector: 'business-indicator-comparison-chart',
  templateUrl: './business-indicator-comparison-chart.component.html',
  styleUrls: ['./business-indicator-comparison-chart.component.scss'],
})
export class BusinessIndicatorComparisonChartComponent implements OnInit {

  @Input()
  businessIndicatorComparison: BusinessIndicatorComparisonModel[];

  @Input()
  pnc: PncModel;

  private readonly DATE_FORMAT = 'DD/MM/YYYY';

  constructor(
    private translateService: TranslateService,
    private pncService: PncService
  ) { }

  ngOnInit() { }

  /**
   * Récupère le label à afficher pour la population donnée
   * @param populationType la population donnée
   * @returns le label )
   */
  getPopulationLabel(populationType: string): string {
    return this.translateService.instant('BUSINESS_INDICATORS.LIST.PAST_SUMMARY.'.concat(populationType));
  }

  /**
     * Vérifie si le PNC est CC et vole sur LC
     * @return vrai si c'est le cas, faux sinon.
     */
  isPncCcLc() {
    return this.pncService.isCcLc(this.pnc);
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
