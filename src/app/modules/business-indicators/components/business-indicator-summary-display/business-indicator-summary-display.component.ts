import {
  BusinessIndicatorPopulationEnum
} from 'src/app/core/enums/business-indicators/business-indicator-population.enum';
import {
  BusinessIndicatorSummaryModel
} from 'src/app/core/models/business-indicator/business-indicator-summary.model';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PncModel } from '../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
  selector: 'business-indicator-summary-display',
  templateUrl: './business-indicator-summary-display.component.html',
  styleUrls: ['./business-indicator-summary-display.component.scss'],
})
export class BusinessIndicatorSummaryDisplayComponent implements OnInit {

  @Input()
  businessIndicatorSummary: BusinessIndicatorSummaryModel;

  @Input()
  pnc: PncModel;

  constructor(private pncService: PncService,
    private translateService: TranslateService) { }

  ngOnInit() { }


  /**
   * Vérifie si le PNC est CC et vole sur LC
   * @returns vrai si c'est le cas, faux sinon
   */
  isCCCL() {
    return (this.pnc == null || this.pnc === undefined) ?
      this.businessIndicatorSummary.population === BusinessIndicatorPopulationEnum.CC_LC :
      this.pncService.isCcLc(this.pnc);
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
