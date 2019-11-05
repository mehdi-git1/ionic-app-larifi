import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import {
    MasteringQualificationModel
} from '../../../../core/models/statutory-certificate/mastering-qualification.model';

@Component({
  selector: 'mastering-qualification',
  templateUrl: 'mastering-qualification.component.html',
  styleUrls: ['./mastering-qualification.component.scss']
})
export class MasteringQualificationComponent implements OnInit {

  @Input() masteringQualificationsData: Array<MasteringQualificationModel>;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

  // Tableau des valeurs à afficher en fonction du type de tableau
  masteringQualificationDisplayedData;

  // Objet temporaire pour formater les données à afficher
  tempMasteringQualificationData;

  constructor(private translateService: TranslateService) {
    this.tempMasteringQualificationData = {
      stages: new Array(),
      seniorityDate: new Array()
    };
  }
  ngOnInit() {
    if (this.masteringQualificationsData && this.masteringQualificationsData.length > 0) {
      for (const masteringQualificationData of this.masteringQualificationsData) {
        this.tempMasteringQualificationData.stages.push(masteringQualificationData.stage);
        this.tempMasteringQualificationData.seniorityDate.push(masteringQualificationData.seniorityDate);
      }
    }

    this.masteringQualificationDisplayedData = {
      headers: [
        this.translateService.instant('STATUTORY_CERTIFICATE.MASTERING_QUALIFICATION.STAGE'),
        this.translateService.instant('STATUTORY_CERTIFICATE.MASTERING_QUALIFICATION.SENIORITY_DATE')
      ], values: this.masteringQualificationsData && this.masteringQualificationsData.length > 0 ?
        [
          { value: this.tempMasteringQualificationData.stages, type: 'text' },
          { value: this.tempMasteringQualificationData.seniorityDate, type: 'date' }
        ]
        :
        null
    };
  }
}
