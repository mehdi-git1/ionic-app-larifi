import { PlaneSkill } from './../../models/statutoryCertificate/planeSkill';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'plane-skills',
  templateUrl: 'plane-skills.html'
})
export class PlaneSkillsComponent implements OnInit {

  @Input() planeSkillsData: Array<PlaneSkill>;


  // Objet temporaire pour formater les données à afficher
  tempPlaneSkillData;

  // Tableau des valeurs à afficher
  planeDisplayedData;

  constructor(public translateService: TranslateService
  ) {
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
    if (this.planeSkillsData) {
      for (const planeSkillData of this.planeSkillsData) {
        this.tempPlaneSkillData.plane.push(planeSkillData.plane);
        this.tempPlaneSkillData.startDate.push(planeSkillData.startDate);
        this.tempPlaneSkillData.mdcDate.push(planeSkillData.mdcDate);
        this.tempPlaneSkillData.dueDate.push(planeSkillData.dueDate);
        this.tempPlaneSkillData.ddvDueDate.push(planeSkillData.ddvDueDate);
        this.tempPlaneSkillData.endDate.push(planeSkillData.endDate);
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
      values: this.planeSkillsData ?
        [
          { value: this.tempPlaneSkillData.plane, type: 'libelle' },
          { value: this.tempPlaneSkillData.startDate, type: 'date' },
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
