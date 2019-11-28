import * as _ from 'lodash';
import { MedicalVisitsModel } from 'src/app/core/models/statutory-certificate/medical-visits.model';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';

@Component({
  selector: 'medical-visits',
  templateUrl: 'medical-visits.component.html',
  styleUrls: ['./medical-visits.component.scss']
})
export class MedicalVisitsComponent implements OnInit {

  @Input() medicalVisitsData: MedicalVisitsModel;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

  // Tableau des valeurs à afficher en fonction du type de tableau
  medicalVisitsDisplayedData;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.medicalVisitsDisplayedData = {
      medicalVisit: {
        headers:
          [
            '',
            this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.END_DATE')
          ],
        values: this.medicalVisitsData && this.medicalVisitsData.medicalVisit ?
          [
            { value: [_.get(this.medicalVisitsData, 'medicalVisit.validityStartDate')], type: 'date' },
            { value: [_.get(this.medicalVisitsData, 'medicalVisit.validityEndDate')], type: 'end-date' }
          ]
          :
          null
      }
    };
  }
}
