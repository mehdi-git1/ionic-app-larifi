import { PncModel } from 'src/app/core/models/pnc.model';

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import {
    BusinessIndicatorPopulationEnum
} from '../../../../core/enums/business-indicators/business-indicator-population.enum copy';
import {
    BusinessIndicatorSummariesModel
} from '../../../../core/models/business-indicator/business-indicator-summaries.model';
import { DeviceService } from '../../../../core/services/device/device.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
  selector: 'business-indicator-summary',
  templateUrl: 'business-indicator-summary.component.html',
  styleUrls: ['./business-indicator-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BusinessIndicatorSummaryComponent implements OnInit {
  @Input() businessIndicatorSummaries: BusinessIndicatorSummariesModel;
  @Input() pnc: PncModel;

  activeSummaryTab: BusinessIndicatorPopulationEnum;

  constructor(
    private pncService: PncService,
    private deviceService: DeviceService
  ) {
  }

  ngOnInit() {
    if (this.businessIndicatorSummaries.businessIndicatorSummaries.length > 0) {
      this.activeSummaryTab = this.businessIndicatorSummaries.businessIndicatorSummaries[0].population;
    }
  }

  /**
   * Vérifie si le PNC est CC et vole sur LC
   * @return vrai si c'est le cas, faux sinon
   */
  isPncCcLc() {
    return this.pncService.isCcLc(this.pnc);
  }

  /**
   * Teste si la valeur existe
   * @param value la valeur à tester
   * @return vrai si c'est le cas, faux sinon
   */
  isDefined(value: any): boolean {
    return value !== undefined;
  }

  /**
   * Teste si on est sur mobile
   * @return vrai si c'est le cas, faux sinon
   */
  isMobile(): boolean {
    return !this.deviceService.isBrowser();
  }

}
