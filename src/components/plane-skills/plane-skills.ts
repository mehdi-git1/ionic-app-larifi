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


  // Objet temporaire pour formater les donénes à afficher
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
      skillEndDate:  new Array()
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
        this.tempPlaneSkillData.skillEndDate.push(i.skillEndDate);
      }
    }else{
      this.tempPlaneSkillData.plane.push('');
      this.tempPlaneSkillData.startDate.push(null);
      this.tempPlaneSkillData.mdcDate.push(null);
      this.tempPlaneSkillData.dueDate.push(null);
      this.tempPlaneSkillData.ddvDueDate.push(null);
      this.tempPlaneSkillData.skillEndDate.push(null);
    }

    this.planeDataDisplayed =
      [{
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.PLANE'),
        value: this.tempPlaneSkillData.plane,
        type: 'libelle'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.STARTDATE'),
        value: this.tempPlaneSkillData.startDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.MDCDATE'),
        value: this.tempPlaneSkillData.mdcDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.DUEDATE'),
        value: this.tempPlaneSkillData.dueDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.DDVDUEDATE'),
        value: this.tempPlaneSkillData.ddvDueDate,
        type: 'date'
      }, {
        libelle: this.translateService.instant('STATUTORY_CERTIFICATE.PLANE_SKILLS.SKILLENDDATE'),
        value: this.tempPlaneSkillData.skillEndDate,
        type: 'end-date'
      }];
  }

}
