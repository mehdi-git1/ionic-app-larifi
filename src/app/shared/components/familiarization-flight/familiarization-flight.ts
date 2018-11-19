import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';

import {FamiliarizationFlights} from '../../../core/models/statutoryCertificate/familiarizationFlights';


@Component({
  selector: 'familiarization-flight',
  templateUrl: 'familiarization-flight.html'
})
export class FamiliarizationFlightComponent implements OnInit {

  @Input() familiarizationFlightData: FamiliarizationFlights;

  // Tableau des valeurs à afficher en fonction du type de tableau
  familiarizationFlightDisplayedData;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    const familiarizationFlights = { flights: new Array(), startDates: new Array() };
    if (this.familiarizationFlightData && this.familiarizationFlightData.fa1Date) {
      familiarizationFlights.flights.push('Fam 1');
      familiarizationFlights.startDates.push(this.familiarizationFlightData.fa1Date);
    }
    if (this.familiarizationFlightData && this.familiarizationFlightData.fa2Date) {
      familiarizationFlights.flights.push('Fam 2');
      familiarizationFlights.startDates.push(this.familiarizationFlightData.fa2Date);
    }


    this.familiarizationFlightDisplayedData = {
      headers: [
        this.translateService.instant('STATUTORY_CERTIFICATE.FAMILIARIZATION_FLIGHTS.FLIGHT'),
        this.translateService.instant('STATUTORY_CERTIFICATE.FAMILIARIZATION_FLIGHTS.START_DATE')
      ], values: this.familiarizationFlightData ?
        [
          { value: familiarizationFlights.flights, type: 'text' },
          { value: familiarizationFlights.startDates, type: 'date' }
        ]
        :
        null
    };
  }
}
