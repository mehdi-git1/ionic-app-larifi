import { HaulType } from './../../models/statutoryCertificate/haulType';
import { FamiliarizationFlights } from './../../models/statutoryCertificate/familiarizationFlights';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'familiarization-flight',
  templateUrl: 'familiarization-flight.html'
})
export class FamiliarizationFlightComponent implements OnInit {

  @Input() familiarizationFlightData: FamiliarizationFlights;

  // Tableau des valeurs à afficher en fonction du type de tableau
  familiarizationFlightDataDisplayed;

  constructor(private translateService: TranslateService) {
    this.familiarizationFlightDataDisplayed = { headers: new Array, values: new Array() };
  }

  ngOnInit() {
    const tempFamiliarizationFlightData = { vols: new Array(), dates: new Array() };
    if (this.familiarizationFlightData && this.familiarizationFlightData.fa1Date) {
      tempFamiliarizationFlightData.vols.push('Fam 1');
      tempFamiliarizationFlightData.dates.push(this.familiarizationFlightData.fa1Date);
    }
    if (this.familiarizationFlightData && this.familiarizationFlightData.fa2Date) {
      tempFamiliarizationFlightData.vols.push('Fam 2');
      tempFamiliarizationFlightData.dates.push(this.familiarizationFlightData.fa2Date);
    }

    this.familiarizationFlightDataDisplayed.headers = [
      this.translateService.instant('STATUTORY_CERTIFICATE.FAMILIARIZATION_FLIGHTS.VOL'),
      this.translateService.instant('STATUTORY_CERTIFICATE.FAMILIARIZATION_FLIGHTS.START_DATE')
    ];
    this.familiarizationFlightDataDisplayed.values = [
      {
        value: tempFamiliarizationFlightData.vols,
        type: 'text'
      },
      {
        value: tempFamiliarizationFlightData.dates,
        type: 'date'
      }
    ];
  }
}
