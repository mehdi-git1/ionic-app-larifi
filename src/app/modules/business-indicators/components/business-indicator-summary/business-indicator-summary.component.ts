

import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';

import {
    BusinessIndicatorPopulationEnum
} from '../../../../core/enums/business-indicators/business-indicator-population.enum';
import {
    BusinessIndicatorSummariesModel
} from '../../../../core/models/business-indicator/business-indicator-summaries.model';
import { DeviceService } from '../../../../core/services/device/device.service';

@Component({
  selector: 'business-indicator-summary',
  templateUrl: 'business-indicator-summary.component.html',
  styleUrls: ['./business-indicator-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BusinessIndicatorSummaryComponent implements OnInit {
  @Input()
  businessIndicatorSummaries: BusinessIndicatorSummariesModel;
  @Input()
  activatedSummaryTab: BusinessIndicatorPopulationEnum;

  @Output()
  activatedSummaryTabOnChange = new EventEmitter<BusinessIndicatorPopulationEnum>();

  constructor(
    private deviceService: DeviceService
  ) {
  }

  ngOnInit() {
    if (this.businessIndicatorSummaries.businessIndicatorSummaries.length > 0) {
      this.activatedSummaryTab = this.businessIndicatorSummaries.businessIndicatorSummaries[0].population;
    }
  }

  /**
   * Teste si on est sur mobile
   * @return vrai si c'est le cas, faux sinon
   */
  isMobile(): boolean {
    return !this.deviceService.isBrowser();
  }

  /**
   * Emet la valeur de l'onglet sélèctionné.
   * @param activeTab l'onglet sélèctionné.
   */
  activatedTabChanged(activeTab: BusinessIndicatorPopulationEnum) {
    this.activatedSummaryTabOnChange.emit(activeTab);
  }
}
