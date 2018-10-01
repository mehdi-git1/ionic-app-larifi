import { VAM } from './../../models/statutoryCertificate/vam';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
@Component({
  selector: 'statutory-certificate-vam',
  templateUrl: 'statutory-certificate-vam.html'
})
export class StatutoryCertificateVamComponent implements OnInit {

  @Input() vamData: VAM;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDataDisplayed;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.skillDataDisplayed = {
      headers:
        [
          this.translateService.instant('STATUTORY_CERTIFICATE.VAM.START_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.VAM.END_DATE')
        ],
      values: this.vamData ?
        [
          { value: [_.get(this.vamData, 'validityStartDate')], type: 'date' },
          { value: [_.get(this.vamData, 'validityEndDate')], type: 'end-date' }
        ]
        :
        null
    };
  }
}
