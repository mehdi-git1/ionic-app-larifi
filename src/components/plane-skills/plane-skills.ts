import { PlaneSkill } from './../../models/statutoryCertificate/planeSkill';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'plane-skills',
  templateUrl: 'plane-skills.html'
})
export class PlaneSkillsComponent implements OnInit{

  @Input() planeSkillsData: Array<PlaneSkill>;


  // Objet temporaire pour formater les données à afficher
  tempPlaneSkillData;

  // Tableau des valeurs à afficher
  planeDataDisplayed: Array<object>;

  constructor(public translateService: TranslateService
   ) {
    this.tempPlaneSkillData = {
      plane: new Array(),
      startDate:  new Array(),
      mdcDate:  new Array(),
      dueDate:  new Array(),
      ddvDueDate:  new Array(),
      endDate:  new Array()
    };
   }

  ngOnInit(){
    if (this.planeSkillsData){
      for (const i of this.planeSkillsData){
        this.tempPlaneSkillData.plane.push(i.plane);
        this.tempPlaneSkillData.startDate.push(i.startDate);
        this.tempPlaneSkillData.mdcDate.push(i.mdcDate);
        this.tempPlaneSkillData.dueDate.push(i.dueDate);
        this.tempPlaneSkillData.ddvDueDate.push(i.ddvDueDate);
        this.tempPlaneSkillData.endDate.push(i.endDate);
      }
    }else{
      this.tempPlaneSkillData.plane.push('');
      this.tempPlaneSkillData.startDate.push(null);
      this.tempPlaneSkillData.mdcDate.push(null);
      this.tempPlaneSkillData.dueDate.push(null);
      this.tempPlaneSkillData.ddvDueDate.push(null);
      this.tempPlaneSkillData.endDate.push(null);
    }

    this.planeDataDisplayed =
      [{
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.PLANE'),
        value: this.tempPlaneSkillData.plane,
        type: 'libelle'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.START_DATE'),
        value: this.tempPlaneSkillData.startDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.MDC_DATE'),
        value: this.tempPlaneSkillData.mdcDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.DUE_DATE'),
        value: this.tempPlaneSkillData.dueDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.DDV_DUE_DATE'),
        value: this.tempPlaneSkillData.ddvDueDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.SKILL_END_DATE'),
        value: this.tempPlaneSkillData.endDate,
        type: 'end-date'
      }];
  }

}
