import { VAM } from './../../models/statutoryCertificate/vam';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
@Component({
  selector: 'statutory-certificate-vam',
  templateUrl: 'statutory-certificate-vam.html'
})
export class StatutoryCertificateVamComponent implements OnInit {

  @Input() vamData: VAM ;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDataDisplayed: Array<object>;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit(){
    this.skillDataDisplayed =
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.VAM.START_DATE'),
            value: [_.get(this.vamData, 'validityStartDate')],
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.VAM.END_DATE'),
            value: [_.get(this.vamData, 'validityEndDate')],
            type: 'end-date'
          }
        ];
  }
}
