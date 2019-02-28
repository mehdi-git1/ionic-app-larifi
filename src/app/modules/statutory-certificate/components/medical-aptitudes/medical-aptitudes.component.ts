import { MedicalAptitudesModel } from './../../../../core/models/statutory-certificate/medical-aptitudes.model';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';
@Component({
  selector: 'medical-aptitudes',
  templateUrl: 'medical-aptitudes.component.html'
})
export class MedicalAptitudesComponent implements OnInit {

  @Input() medicalAptitudesData: MedicalAptitudesModel;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDisplayedData;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.skillDisplayedData = {
      headers:
        [
          this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_APTITUDES.START_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_APTITUDES.END_DATE')
        ],
      values: this.medicalAptitudesData ?
        [
          { value: [_.get(this.medicalAptitudesData, 'validityStartDate')], type: 'date' },
          { value: [_.get(this.medicalAptitudesData, 'validityEndDate')], type: 'end-date' }
        ]
        :
        null
    };
  }
}
