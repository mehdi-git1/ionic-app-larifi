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

  // Tableau des libelles des visites médicales
  medicalVisitTitleArray: Array<string>;

  // Tableau des listes de START_DATE
  startDateArray: Array<string>;

  // Tableau des listes de END_DATE
  endDateArray: Array<string>;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    if (this.medicalVisitsData && this.medicalVisitsData.medicalAptitude) {
      this.medicalVisitTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.MEDICAL_APTITUDE'));
      this.startDateArray.push(_.get(this.medicalVisitsData, 'medicalAptitude.validityStartDate'));
      this.startDateArray.push(_.get(this.medicalVisitsData, 'medicalAptitude.validityEndDate'));
    }

    if (this.medicalVisitsData && this.medicalVisitsData.workVisit) {
      this.medicalVisitTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.WORK_VISIT'));
      this.startDateArray.push(_.get(this.medicalVisitsData, 'workVisit.validityStartDate'));
      this.endDateArray.push(_.get(this.medicalVisitsData, 'workVisit.validityEndDate'));
    }

    this.medicalVisitsDisplayedData = {
      medicalVisit: {
        headers:
          [
            '',
            this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.MEDICAL_VISITS.END_DATE')
          ],
        values: this.medicalVisitsData ?
          [
            { value: this.medicalVisitTitleArray, type: 'text' },
            { value: this.startDateArray, type: 'date' },
            { value: this.endDateArray, type: 'date' },
          ]
          :
          null
      }
    };
  }
}
