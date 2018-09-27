import { FamiliarizationFlight } from './../../models/statutoryCertificate/familiarizationFlight';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'familiarization-flight',
  templateUrl: 'familiarization-flight.html'
})
export class FamiliarizationFlightComponent implements OnInit {

  @Input() familiarizationFlightData: FamiliarizationFlight;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDataDisplayed: Array<object>;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.skillDataDisplayed =
      [{
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.VAM.START_DATE'),
        value: [_.get(this.familiarizationFlightData, 'validityStartDate')],
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.VAM.END_DATE'),
        value: [_.get(this.familiarizationFlightData, 'validityEndDate')],
        type: 'end-date'
      }
      ];
  }
}
