import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'business-indicator-flight-legend',
  templateUrl: 'business-indicator-flight-legend.component.html',
  styleUrls: ['./business-indicator-flight-legend.component.scss']
})

export class BusinessIndicatorFlightLegendComponent {

  hasNeverFlownAsCcLcDuringPastYear: boolean;

  notCcLcLegend: string;
  ccLcLegend: any;

  constructor(
    private navParams: NavParams,
    private translateService: TranslateService
  ) {
    this.hasNeverFlownAsCcLcDuringPastYear = this.navParams.get('hasNeverFlownAsCcLcDuringPastYear');

    this.notCcLcLegend = this.translateService.instant('BUSINESS_INDICATORS.LIST.LEGEND.NOT_CC_LC');
    this.ccLcLegend = {
      dashLegend: this.translateService.instant('BUSINESS_INDICATORS.LIST.LEGEND.CC_LC_DASH'),
      naLegend: this.translateService.instant('BUSINESS_INDICATORS.LIST.LEGEND.CC_LC_NA')
    }
  }

}
