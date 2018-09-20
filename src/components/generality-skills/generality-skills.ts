import { GeneralitySkills } from './../../models/statutoryCertificate/generalitySkills';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'generality-skills',
  templateUrl: 'generality-skills.html'
})
export class GeneralitySkillsComponent implements OnInit{

  @Input() generalitySkillsData: GeneralitySkills ;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDataDisplayed: {};

  constructor(public translateService: TranslateService
   ) {
    this.skillDataDisplayed = {cca: [], pcb: [], gene: []};
   }

  ngOnInit(){
    this.skillDataDisplayed = {
      cca:
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.TITLE'),
            value: _.get(this.generalitySkillsData, 'cca.libelle'),
            type: 'libelle'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.STARTDATE'),
            value: _.get(this.generalitySkillsData, 'cca.startDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.DUEDATE'),
            value: _.get(this.generalitySkillsData, 'cca.dueDate'),
            type: 'date'
          }
        ],
      pcb:
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.TITLE'),
            value: _.get(this.generalitySkillsData, 'pcb.libelle'),
            type: 'libelle'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.STARTDATE'),
            value: _.get(this.generalitySkillsData, 'pcb.startDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.VALIDITYSTARTDATE'),
            value: _.get(this.generalitySkillsData, 'pcb.validityStartDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.DUEDATE'),
            value: _.get(this.generalitySkillsData, 'pcb.dueDate'),
            type: 'date'
          }
        ],
      gene:
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.AIRCRAFTSKILL'),
            value: _.get(this.generalitySkillsData, 'gene.aircraftSkill'),
            type: 'libelle'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.STARTDATE'),
            value: _.get(this.generalitySkillsData, 'gene.startDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.MDCDATE'),
            value: _.get(this.generalitySkillsData, 'gene.validityStartDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.DUEDATE'),
            value: _.get(this.generalitySkillsData, 'gene.dueDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.DDVDUEDATE'),
            value: _.get(this.generalitySkillsData, 'gene.ddvDueDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.SKILLENDDATE'),
            value: _.get(this.generalitySkillsData, 'gene.endDate'),
            type: 'end-date'
          }
        ]
    };
  }

}
