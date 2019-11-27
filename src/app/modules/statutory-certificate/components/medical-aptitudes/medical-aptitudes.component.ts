import * as _ from 'lodash';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import {
    MedicalAptitudesModel
} from '../../../../core/models/statutory-certificate/medical-aptitudes.model';

@Component({
  selector: 'medical-aptitudes',
  templateUrl: 'medical-aptitudes.component.html',
  styleUrls: ['./medical-aptitudes.component.scss']
})
export class MedicalAptitudesComponent implements OnInit {

  @Input() medicalAptitudesData: MedicalAptitudesModel;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

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
