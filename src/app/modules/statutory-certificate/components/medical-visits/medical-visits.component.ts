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

  // // Tableau des libelles des visites médicales
  // medicalVisitTitleArray: Array<string>;

  // // Tableau des listes de START_DATE
  // startDateArray: Array<string>;

  // // Tableau des listes de END_DATE
  // endDateArray: Array<string>;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    const medicalVisitTitleArray = new Array();
    const startDateArray = new Array();
    const endDateArray = new Array();
    if (this.medicalVisitsData && this.medicalVisitsData.medicalAptitude) {
      medicalVisitTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.MEDICAL_APTITUDE'));
      startDateArray.push(_.get(this.medicalVisitsData, 'medicalAptitude.validityStartDate'));
      endDateArray.push(_.get(this.medicalVisitsData, 'medicalAptitude.validityEndDate'));
    }

    if (this.medicalVisitsData && this.medicalVisitsData.workVisit) {
      medicalVisitTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.WORK_VISIT'));
      startDateArray.push(_.get(this.medicalVisitsData, 'workVisit.validityStartDate'));
      endDateArray.push(_.get(this.medicalVisitsData, 'workVisit.validityEndDate'));
    }

    this.medicalVisitsDisplayedData = {
      headers:
        [
          '',
          this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.START_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.END_DATE')
        ],
      values: this.medicalVisitsData ?
        [
          { value: medicalVisitTitleArray, type: 'text' },
          { value: startDateArray, type: 'date' },
          { value: endDateArray, type: 'date' },
        ]
        :
        null
    };
  }
}
