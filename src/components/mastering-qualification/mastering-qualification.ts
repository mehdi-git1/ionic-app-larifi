import { TranslateService } from '@ngx-translate/core';
import { MasteringQualification } from './../../models/statutoryCertificate/masteringQualification';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mastering-qualification',
  templateUrl: 'mastering-qualification.html'
})
export class MasteringQualificationComponent implements OnInit {

  @Input() masteringQualificationData: MasteringQualification;

  // Tableau des valeurs à afficher en fonction du type de tableau
  masteringQualificationDisplayedData;

  constructor(private translateService: TranslateService) {

  }
  ngOnInit() {

    this.masteringQualificationDisplayedData = {
      headers: [
        this.translateService.instant('STATUTORY_CERTIFICATE.MASTERING_QUALIFICATION.SPECIALITY'),
        this.translateService.instant('STATUTORY_CERTIFICATE.MASTERING_QUALIFICATION.START_DATE')
      ], values: this.masteringQualificationData ?
        [
          { value: [this.masteringQualificationData.currentSpeciality], type: 'text' },
          { value: [this.masteringQualificationData.siniorityDate], type: 'date' }
        ]
        :
        null
    };
  }
}
