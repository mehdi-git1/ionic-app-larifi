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
  medicalAptitudesDisplayedData;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.medicalAptitudesDisplayedData = {
      medicalVisit: {
        headers:
          [
            this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_APTITUDES.MEDICAL_VISIT.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_APTITUDES.MEDICAL_VISIT.END_DATE')
          ],
        values: this.medicalAptitudesData && this.medicalAptitudesData.medicalVisit ?
          [
            { value: [_.get(this.medicalAptitudesData, 'medicalVisit.validityStartDate')], type: 'date' },
            { value: [_.get(this.medicalAptitudesData, 'medicalVisit.validityEndDate')], type: 'end-date' }
          ]
          :
          null
      }
    };
  }
}
