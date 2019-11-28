

import * as moment from 'moment';

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import { PlaneSkillModel } from '../../../../core/models/statutory-certificate/plane-skill.model';

@Component({
  selector: 'plane-skills',
  templateUrl: 'plane-skills.component.html',
  styleUrls: ['./plane-skills.component.scss']
})
export class PlaneSkillsComponent implements OnInit {

  @Input() planeSkillsData: Array<PlaneSkillModel>;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;


  // Objet temporaire pour formater les données à afficher
  tempPlaneSkillData;

  // Tableau des valeurs à afficher
  planeDisplayedData;

  constructor(
    public translateService: TranslateService) {
    this.tempPlaneSkillData = {
      plane: new Array(),
      startDate: new Array(),
      mdcDate: new Array(),
      dueDate: new Array(),
      ddvDueDate: new Array(),
      endDate: new Array()
    };
  }

  ngOnInit() {
    if (this.planeSkillsData && this.planeSkillsData.length > 0) {
      const now = moment();
      for (const planeSkillData of this.planeSkillsData) {
        if (now.isBefore(planeSkillData.ddvDueDate) || now.isBefore(planeSkillData.endDate)) {
          this.tempPlaneSkillData.plane.push(planeSkillData.plane);
          this.tempPlaneSkillData.startDate.push(planeSkillData.startDate);
          this.tempPlaneSkillData.mdcDate.push(planeSkillData.mdcDate);
          this.tempPlaneSkillData.dueDate.push(planeSkillData.dueDate);
          this.tempPlaneSkillData.ddvDueDate.push(planeSkillData.ddvDueDate);
          this.tempPlaneSkillData.endDate.push(planeSkillData.endDate);
        }
      }
    }

    this.planeDisplayedData = {
      headers:
        [
          this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.PLANE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.START_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.MDC_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.DUE_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.DDV_DUE_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.SKILL_END_DATE')
        ],
      values: this.planeSkillsData && this.planeSkillsData.length > 0 ?
        [
          { value: this.tempPlaneSkillData.plane, type: 'libelle' },
          // { value: this.tempPlaneSkillData.startDate, type: 'date' },
          { value: [''], type: 'date' },
          { value: this.tempPlaneSkillData.mdcDate, type: 'date' },
          { value: this.tempPlaneSkillData.dueDate, type: 'end-date' },
          { value: this.tempPlaneSkillData.ddvDueDate, type: 'end-date' },
          { value: this.tempPlaneSkillData.endDate, type: 'end-date' }
        ]
        :
        null
    };
  }
}
